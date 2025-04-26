export default function Form() {
  return (
    <div className="form-container">
      <h1>Please fill all the required fields</h1>
      <form action="">
        <div className="input-container">
          <label htmlFor="name">Name </label>
          <input type="text" id="name" />
        </div>

        <div className="input-container">
          <label htmlFor="email">Email </label>
          <input type="email" id="email" />
        </div>

        <div className="input-container">
          <label htmlFor="phone">Phone </label>
          <input type="tel" id="phone" />
        </div>

        <div className="input-container">
          <label htmlFor="itemType">Item Type</label>
          <select id="itemType" className="form-select">
            <option value="">Select Type</option>
            <option value="lost">Lost Item</option>
            <option value="found">Found Item</option>
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="title">Title </label>
          <input type="text" id="title" />
        </div>

        <div className="input-container">
          <label htmlFor="description">Description </label>
          <textarea id="description"></textarea>
        </div>

        <div className="input-container">
          <input type="file" accept="image/*" />
        </div>

        <div className="input-container">
          <input type="submit" className="submitbtn" value="Submit" />
        </div>
      </form>
    </div>
  );
}