export default (headers = []) => {
  return headers.map((head) => ({
    text: head,
    value: head,
    sort: false,
    sortable: false,
    align: "center",
  }));
};
