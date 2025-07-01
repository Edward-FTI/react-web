// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import login from '../Components/Login.jsx';

// // Main Navbar + Sidebar Component
// const NavbarCustomer_Service = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear session storage or any other logout logic
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
//     navigate('/'); // Redirect to login page
//   }
//   return (
//     <>
//       {/* Navbar */}
//       <div style={styles.navbar}>
//         <button
//           style={styles.iconButton}
//           type="button"
//           data-bs-toggle="offcanvas"
//           data-bs-target="#offcanvasWithBothOptions"
//           aria-controls="offcanvasWithBothOptions"
//         >
//           <img
//             src="https://img.icons8.com/?size=100&id=8113&format=png&color=FFFFFF"
//             alt="menu"
//             style={styles.icon}
//           />
//         </button>

//         <button style={styles.logoutButton} onClick={() => { handleLogout() }}>
//           <img
//             src="https://img.icons8.com/?size=100&id=24337&format=png&color=FFFFFF"
//             alt="logout"
//             style={styles.icon}
//           />
//           <span style={styles.logoutText}>Log out</span>
//         </button>
//       </div>

//       {/* Sidebar / Offcanvas */}
//       <div
//         className="offcanvas offcanvas-start bg-success text-white"
//         data-bs-scroll="true"
//         // tabIndex="-1"
//         tabIndex={-1}
//         id="offcanvasWithBothOptions"
//         aria-labelledby="offcanvasWithBothOptionsLabel"
//       >
//         <div className="offcanvas-header">
//           <div className="d-flex align-items-center fw-bold fs-5 text-white">
//             {/* <img src="/logo.png" alt="logo" width="40" className="me-2" /> */}
//             Reusemart
//           </div>
//           <button
//             type="button"
//             className="btn-close text-reset"
//             data-bs-dismiss="offcanvas"
//             aria-label="Close"
//           ></button>
//         </div>
//         <div className="offcanvas-body">
//           <LinkSidebar navigate={navigate} />
//         </div>
//       </div>
//     </>
//   );
// };


// // Sidebar Link Items
// const LinkSidebar = ({ navigate }) => {
//   return (
//     <div className="d-flex flex-column gap-3">
//       <DrawerItem label="Dashboard" icon="https://img.icons8.com/?size=100&id=iPqKoSmxmAyJ&format=png&color=000000" onClick={() => navigate('/dashboard')} />
//       <DrawerItem label="Penitip" icon="https://img.icons8.com/?size=100&id=13042&format=png&color=000000" onClick={() => navigate('/penitip')} />
//       <DrawerItem label="Diskusi" icon="https://img.icons8.com/?size=100&id=13042&format=png&color=000000" />
//       <DrawerItem label="Merchandise" icon="https://img.icons8.com/?size=100&id=FYDMKDveHa85&format=png&color=000000" onClick={() => navigate('merchandise')} />
//     </div>
//   );
// };

// // Drawer Item
// const DrawerItem = ({ label, icon, onClick }) => (
//   <button onClick={onClick} className="btn btn-link text-start text-white d-flex align-items-center gap-2">
//     <img src={icon} alt={label} width="24" height="24" />
//     {label}
//   </button>
// );

// // Styles
// const styles = {
//   navbar: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'green',
//     padding: '10px'
//   },
//   icon: {
//     width: '30px',
//     height: '30px'
//   },
//   iconButton: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer'
//   },
//   logoutButton: {
//     display: 'flex',
//     alignItems: 'center',
//     background: 'none',
//     border: 'none',
//     gap: '5px',
//     cursor: 'pointer',
//     color: '#fff'
//   },
//   logoutText: {
//     color: '#fff',
//     marginLeft: '5px'
//   }
// };

// export default NavbarCustomer_Service;
