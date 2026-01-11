const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  const style = {
    borderStyle: "solid",
    padding: 10,
    marginBottom: 10,
  };

  if (type === "error") {
    style.color = "red";
  }

  if (type === "success") {
    style.color = "green";
  }

  return <div style={style}>{message}</div>;
};

export default Notification;
