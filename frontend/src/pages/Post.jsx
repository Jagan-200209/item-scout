import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { api } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Post() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("found"); // "found" or "lost"
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    title: "",
    desc: "",
    location: "",
    date: "",
    loseDate: "",
    file: null,
    itemType: "found"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData(prev => ({
      ...prev,
      itemType: tab,
      title: "",
      desc: "",
      location: "",
      date: "",
      loseDate: "",
      file: null
    }));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.desc.trim()) {
      newErrors.desc = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.file) {
      newErrors.file = 'Please upload an image';
    }

    if (activeTab === 'found' && !formData.date) {
      newErrors.date = 'Date is required';
    }

    if (activeTab === 'lost' && !formData.loseDate) {
      newErrors.loseDate = 'Lose date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitData = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("phoneno", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.desc);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("loseDate", formData.loseDate);
    formDataToSend.append("itemType", activeTab);
    formDataToSend.append("file", formData.file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${api}/item`, formDataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      enqueueSnackbar(`${activeTab === 'lost' ? 'Lost' : 'Found'} Item Posted Successfully`, { variant: "success" });
      navigate("/find");
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.response?.data?.message || "Error posting item", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="postItem">
      <Navbar />
      <section>
        <div className="tab-container">
          <button 
            className={`tab-button ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => handleTabChange('found')}
          >
            Post Found Item
          </button>
          <button 
            className={`tab-button ${activeTab === 'lost' ? 'active' : ''}`}
            onClick={() => handleTabChange('lost')}
          >
            Post Lost Item
          </button>
        </div>

        <div className="form-container">
          <h2>
            {activeTab === 'found' 
              ? 'Report an item you found' 
              : 'Report an item you lost'}
          </h2>
          <form className="form" onSubmit={submitData} autoComplete="off">
            <div className="input-container">
              <label htmlFor="name">
                {activeTab === 'found' ? 'Founder Name *' : 'Loser Name *'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                autoComplete="off"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="input-container">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                autoComplete="off"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-container">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                autoComplete="off"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="input-container">
              <label htmlFor="title">
                {activeTab === 'found' ? 'What did you find? *' : 'What did you lose? *'}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                autoComplete="off"
                placeholder={activeTab === 'found' ? 'Name of the item you found' : 'Name of the item you lost'}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="input-container">
              <label htmlFor="location">
                {activeTab === 'found' ? 'Where did you find it? *' : 'Where did you lose it? *'}
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
                autoComplete="off"
                placeholder="Specific location details"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            {activeTab === 'found' && (
              <div className="input-container">
                <label htmlFor="date">Date Found *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'error' : ''}
                  autoComplete="off"
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>
            )}

            {activeTab === 'lost' && (
              <div className="input-container">
                <label htmlFor="loseDate">Lose Date *</label>
                <input
                  type="date"
                  id="loseDate"
                  name="loseDate"
                  value={formData.loseDate}
                  onChange={handleChange}
                  className={errors.loseDate ? 'error' : ''}
                  autoComplete="off"
                />
                {errors.loseDate && <span className="error-message">{errors.loseDate}</span>}
              </div>
            )}

            <div className="input-container">
              <label htmlFor="desc">Description *</label>
              <textarea
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                className={errors.desc ? 'error' : ''}
                placeholder={activeTab === 'found' 
                  ? 'Describe the item you found (color, brand, condition, etc.)' 
                  : 'Describe the item you lost (color, brand, distinguishing features, etc.)'}
                autoComplete="off"
              />
              {errors.desc && <span className="error-message">{errors.desc}</span>}
            </div>

            <div className="input-container">
              <label htmlFor="file">Upload Image *</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.file ? 'error' : ''}
              />
              {errors.file && <span className="error-message">{errors.file}</span>}
              {formData.file && (
                <div className="image-preview">
                  <img 
                    src={URL.createObjectURL(formData.file)} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', marginTop: '10px' }}
                  />
                </div>
              )}
            </div>

            <div className="input-container">
              <button 
                type="submit" 
                className="submitbtn" 
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? "Posting..." 
                  : `Post ${activeTab === 'found' ? 'Found' : 'Lost'} Item`}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
