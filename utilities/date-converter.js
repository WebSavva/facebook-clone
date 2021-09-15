export default function convertDate(isoDate) {
  const currentDateObject = new Date(isoDate);
  return {
    date: new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
      currentDateObject
    ),
    moment: new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(
      currentDateObject
    ),
  };
}
