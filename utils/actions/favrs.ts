import path from "path";
import mongoose from "mongoose";
import { getSocketIo } from "../websocket";
import { getSocketById } from "../socket_util";
import { sendPushNotification } from "../push_notification";

interface RequestOffer {
  _id: mongoose.Types.ObjectId;
  favr_id: string;
  general_info_socket: {
    path: string;
    emitter: string;
  };
  partner_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  status: string;
}

interface ControllerData {
  favr_id: string;
}

/**
 * ProgrammerRequestOffer
 *
 * This function is used to send a request to a partner when the cron is triggered.
 * It checks if there is an accepted offer for the same favr, if not, it sends the request to the partner.
 * If the partner is not online, it sends a push notification.
 * Then, it updates the status of the current offer to "sended" and sets the next pending offer to "next_to_send".
 *
 * @param {RequestOffer} request_offer - The request offer to be processed.
 * @returns {Promise<void>}
 */
const programmerRequestOffer = async (
  request_offer: RequestOffer
): Promise<void> => {

  if (request_offer.status === "next_to_send") {
    const { favr_id, general_info_socket, partner_id, category_id } =
      request_offer;
    const io = getSocketIo();
    const existsOffer = await mongoose
      .model("RequestOffer")
      .findOne({ favr_id, status: "accepted" });

    if (!existsOffer) {
      const partner = await getSocketById(
        io.of(general_info_socket.path) as any,
        partner_id.toString()
      );

      const favr = await mongoose
        .model("Favr")
        .findOne({ _id: favr_id })
        .populate([
          "category_id",
          {
            path: "user_id",
            select: "name first_name last_name profile_picture",
          },
        ]);

      const category = await mongoose
        .model("Category")
        .findOne({ _id: category_id });

      if (partner) {
        io.of(general_info_socket.path)
          .to(partner_id.toString())
          .emit(general_info_socket.emitter, {
            action: "request_favr",
            data: favr,
          });
      } else {
        const payload = {
          notification: {
            title: "Nuevo favor",
            body: `La categoria ${category?.name || ""} tiene un nuevo favor`,
          },
          data: {
            type: "add_request",
            favr_id: favr?._id.toString() || "",
          },
        };
        sendPushNotification(payload, partner_id.toString());
      }

      await mongoose
        .model("RequestOffer")
        .updateOne({ _id: request_offer._id }, { status: "sended" });

      const next_sended = await mongoose
        .model("RequestOffer")
        .findOne({ favr_id, status: "pending" });

      if (next_sended) {
        await next_sended.updateOne({ status: "next_to_send" });
      }
    }
  }
};

const controllerNextRequestOffer = async (
  data: ControllerData
): Promise<void> => {
  const request_favr = await mongoose
    .model("RequestOffer")
    .findOne({ favr_id: data.favr_id, status: "next_to_send" });

  if (request_favr) {
    await programmerRequestOffer(request_favr as RequestOffer);
  }
};

/**
 * Function to accept an offer.
 * If the offer is accepted, the function search the next pending offer
 * and update the status to "next_to_send". Then, call the controllerNextRequestOffer
 * function to send the offer to the user.
 * @param data - object with the required data to accept the offer
 * @returns {Promise<void>}
 */

const controllerAcceptOffer = async (data: ControllerData): Promise<void> => {
  const request_favr = await mongoose
    .model("RequestOffer")
    .findOne({ favr_id: data.favr_id, status: "accepted" });

  if (!request_favr) {
    const request_favr_next_pending = await mongoose
      .model("RequestOffer")
      .findOne({ favr_id: data.favr_id, status: "next_to_send_pending" });

    if (request_favr_next_pending) {
      await request_favr_next_pending.updateOne({ status: "next_to_send" });
      controllerNextRequestOffer(data);
    }
  }
};

/**
 * Restart the cron for the offer, sending the next pending offer or the next offer in line
 * This function is used to restart the cron when the server is restarted
 */
const restartCronOffer = async (): Promise<void> => {
  console.log("restarting... offer cron");

  const request_favr = await mongoose.model("RequestOffer").find({
    $or: [{ status: "next_to_send" }, { status: "next_to_send_pending" }],
  });

  for (const request_offer of request_favr) {
    if (request_offer.status === "next_to_send_pending") {
      await controllerAcceptOffer({ favr_id: request_offer.favr_id });
    }

    if (request_offer.status === "next_to_send") {
      await controllerNextRequestOffer({ favr_id: request_offer.favr_id });
    }
  }
};

export {
  programmerRequestOffer,
  controllerNextRequestOffer,
  restartCronOffer,
  controllerAcceptOffer,
};
