import { CronJob } from 'cron';

// Define types for the parameters
type ExecuteAction = () => void;

/**
 * Creates a cron job
 * @param date - The date .
 * @param executeAction - The action job runs.
 * @param title - An optional title .
 */
const createJobForDate = async (
  date: Date | string,
  executeAction: ExecuteAction,
  title: string = ""
): Promise<void> => {
  console.log("createJobForDate:", date, title);

  const cron = new CronJob(
    date,
    async function () {
      await executeAction();
    },
    null,
    true,
    "UTC"
  );

  console.log("Next 5 execution dates:", cron.nextDates(5));
};

export {
  createJobForDate,
};
