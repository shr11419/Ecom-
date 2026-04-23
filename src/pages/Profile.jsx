import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiUser, FiMail, FiMapPin, FiLogOut, FiEdit2, FiMoon, FiSun } from "react-icons/fi";

export default function Profile({ theme, setTheme }) {
  const { user, logout, saveName } = useAuth();
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [address, setAddress] = useState(
    localStorage.getItem("userAddress") || ""
  );
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(address);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-not-logged-in">
          <div className="profile-nl-emoji">👤</div>
          <h2>You're not logged in</h2>
          <p>Login or sign up to view your profile</p>
          <button className="auth-submit-btn" onClick={() => navigate("/auth")}>
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  function handleSaveName() {
    if (nameInput.trim()) {
      saveName(nameInput.trim());
      setEditingName(false);
    }
  }

  function handleSaveAddress() {
    localStorage.setItem("userAddress", addressInput);
    setAddress(addressInput);
    setEditingAddress(false);
  }

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  const initial = user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        {editingName ? (
          <div className="profile-edit-row">
            <input
              className="profile-edit-input"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              autoFocus
            />
            <button className="profile-save-btn" onClick={handleSaveName}>Save</button>
            <button className="profile-cancel-btn" onClick={() => setEditingName(false)}>Cancel</button>
          </div>
        ) : (
          <div className="profile-name-row">
            <h2 className="profile-name">{user.name || "Set your name"}</h2>
            <button className="profile-edit-icon" onClick={() => setEditingName(true)}>
              <FiEdit2 size={16} />
            </button>
          </div>
        )}
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-card">
        <div className="profile-row">
          <FiMail size={18} className="profile-row-icon" />
          <div>
            <p className="profile-row-label">Email</p>
            <p className="profile-row-value">{user.email}</p>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-row">
          <FiMapPin size={18} className="profile-row-icon" />
          <div className="profile-row-content">
            <p className="profile-row-label">Delivery Address</p>
            {editingAddress ? (
              <div className="profile-edit-col">
                <textarea
                  className="profile-address-input"
                  value={addressInput}
                  onChange={e => setAddressInput(e.target.value)}
                  placeholder="Enter your full address"
                  rows={3}
                />
                <div className="profile-edit-actions">
                  <button className="profile-save-btn" onClick={handleSaveAddress}>Save</button>
                  <button className="profile-cancel-btn" onClick={() => setEditingAddress(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-address-row">
                <p className="profile-row-value">
                  {address || "No address saved yet"}
                </p>
                <button className="profile-edit-icon" onClick={() => setEditingAddress(true)}>
                  <FiEdit2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-card profile-theme-row">
        <div className="profile-row" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {theme === "dark" ? <FiMoon size={18} className="profile-row-icon" /> : <FiSun size={18} className="profile-row-icon" />}
            <div>
              <p className="profile-row-label">Theme</p>
              <p className="profile-row-value">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
            </div>
          </div>
          <div
            className={`theme-toggle ${theme}`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <div className="toggle-circle">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </div>
        </div>
      </div>

      <button className="profile-logout-btn" onClick={handleLogout}>
        <FiLogOut size={16} />
        Logout
      </button>
    </div>
  );
}