import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Projects from './pages/Projects/Projects';
import SingleProject from './pages/Projects/SingleProject';
import News from './pages/News/News';
import SingleNews from './pages/News/SingleNews';
import Activities from './pages/Activities/Activities';
import SingleActivity from './pages/Activities/SingleActivity';
import Participation from './pages/Participation/Participation';
import Partners from './pages/Partners/Partners';
import Photos from './pages/Photos/Photos';
import Autisme from './pages/Autisme/Autisme';
import SingleAutismePage from './pages/Autisme/SingleAutismePage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EditProfile from './pages/Auth/EditProfile';
import AdminLogin from './pages/Auth/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminTuteurs from './pages/Admin/AdminTuteurs';
import AdminActivities from './pages/Admin/AdminActivities';
import AddActivity from './pages/Admin/AddActivity';
import AdminNews from './pages/Admin/AdminNews';
import AddNews from './pages/Admin/AddNews';
import AdminPartners from './pages/Admin/AdminPartners';
import AddPartner from './pages/Admin/AddPartner';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminAdmins from './pages/Admin/AdminAdmins';
import AdminImages from './pages/Admin/AdminImages';
import AdminStaticPages from './pages/Admin/AdminStaticPages';
import Contact from './pages/Contact/Contact';
import ObjectPage from './pages/Static/ObjectPage';
import ClubPage from './pages/Static/ClubPage';
import ClubMeetPage from './pages/Static/ClubMeetPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login - Blank Layout */}
        <Route path="/connecte" element={<AdminLogin />} />

        {/* Public Routes - Main Layout */}
        <Route path="*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projets" element={<Projects />} />
              <Route path="/projet/:id" element={<SingleProject />} />
              <Route path="/nosInfos" element={<News />} />
              <Route path="/Information/:id" element={<SingleNews />} />
              <Route path="/nosActivites" element={<Activities />} />
              <Route path="/uneActivite/:id" element={<SingleActivity />} />
              <Route path="/vouloirParticiper/:activite_id" element={<Participation />} />
              <Route path="/partenaires" element={<Partners />} />
              <Route path="/nosPhotos" element={<Photos />} />
              <Route path="/autisme" element={<Autisme />} />
              <Route path="/page_autisme/:id" element={<SingleAutismePage />} />
              <Route path="/se_connecter" element={<Login />} />
              <Route path="/inscription" element={<Register />} />
              <Route path="/tuteur/:id/modifier" element={<EditProfile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/object" element={<ObjectPage />} />
              <Route path="/club" element={<ClubPage />} />
              <Route path="/clubmeet" element={<ClubMeetPage />} />
            </Routes>
          </MainLayout>
        } />

        {/* Admin Routes - Admin Layout */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/tuteurs" element={<AdminTuteurs />} />
              <Route path="/activites" element={<AdminActivities />} />
              <Route path="/ajoutActivite" element={<AddActivity />} />
              <Route path="/infos" element={<AdminNews />} />
              <Route path="/ajoutInfo" element={<AddNews />} />
              <Route path="/partenaires" element={<AdminPartners />} />
              <Route path="/ajoutPartenaire" element={<AddPartner />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="/admins" element={<AdminAdmins />} />
              <Route path="/images" element={<AdminImages />} />
              <Route path="/pages" element={<AdminStaticPages />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
