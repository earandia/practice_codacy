import Stripe from 'stripe';
import config from "../config/variables";
/**
 * Retrieves a Stripe account by ID.
 *
 * @param {string} acount_id - The Stripe account ID to retrieve.
 *
 * @returns {Promise<Stripe.Account | {error: string, message: string, code?: string, type?: string}>}
 * A promise that resolves with the retrieved Stripe account or an error object.
 */
export const get_stripe = async (acount_id: any) =>{
    try {
        const stripe = new Stripe(config.key_stripe??'');
        const account = await stripe.accounts.retrieve(
            acount_id
        );
        return account;
    }catch (e:any) {
        return {
            error:'account_error',
            message:(e.raw.param?e.raw.param:"")+" "+(e.raw.message?e.raw.message:undefined),
            code:e.raw.code?e.raw.code:undefined,
            type:e.type
        }
    }
}