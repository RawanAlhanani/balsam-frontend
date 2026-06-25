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
import AdminNews from './pages/Admin/AdminNews';
import AdminPartners from './pages/Admin/AdminPartners';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminAdmins from './pages/Admin/AdminAdmins';
import AdminImages from './pages/Admin/AdminImages';
import AdminStaticPages from './pages/Admin/AdminStaticPages';
import AddStaticPage from './pages/Admin/AddStaticPage'; // Import new component
import EditStaticPage from './pages/Admin/EditStaticPage'; // Import new component
import AdminMeetings from './pages/Admin/AdminMeetings';
import AdminActivityReports from './pages/Admin/AdminActivityReports';
import AdminFinance from './pages/Admin/AdminFinance';
import Contact from './pages/Contact/Contact';
import ObjectPage from './pages/Static/ObjectPage';
import ClubPage from './pages/Static/ClubPage';
import ClubMeetPage from './pages/Static/ClubMeetPage';
import CentreAbout from './pages/CentreBalsam/CentreAbout';
import ServicePath from './pages/CentreBalsam/ServicePath';
import RegistrePath from './pages/CentreBalsam/RegistrePath';
import PsychologicalSupport from './pages/CentreBalsam/PsychologicalSupport';
import SpeechTherapy from './pages/CentreBalsam/SpeechTherapy';
import MotorTherapy from './pages/CentreBalsam/MotorTherapy';
import SpecialEducation from './pages/CentreBalsam/SpecialEducation';
import Ergotherapy from './pages/CentreBalsam/Ergotherapy';
import ProgramsAndActivities from './pages/CentreBalsam/ProgramsAndActivities';
import DevenirStagiaire from './pages/CentreBalsam/DevenirStagiaire';
import AdminStagiaires from './pages/Admin/AdminStagiaires';
import DevenirBenevole from './pages/CentreBalsam/DevenirBenevole';
import AdminVolunteers from './pages/Admin/AdminVolunteers';
import TeamPage from './pages/CentreBalsam/TeamPage';

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
              <Route path="/centre/devenir-stagiaire" element={<DevenirStagiaire />} />
              <Route path="/centre/about" element={<CentreAbout />} />
              <Route path="/centre/process" element={<ServicePath />} />
              <Route path="/centre/programmes" element={<ProgramsAndActivities />} />
              <Route path="/centre/psychological-support" element={<PsychologicalSupport />} />
              <Route path="/centre/inscription" element={<RegistrePath />} />
              <Route path="/centre/orthophonie" element={<SpeechTherapy />} />
              <Route path="/centre/psychomoteur" element={<MotorTherapy />} />
              <Route path="/centre/education-speciale" element={<SpecialEducation />} />
              <Route path="/centre/ergotherapie" element={<Ergotherapy />} />
              <Route path="/centre/devenir-benevole" element={<DevenirBenevole />} />
              <Route path="/centre/team" element={<TeamPage />} />
            </Routes>
          </MainLayout>
        } />

        {/* Admin Routes - Admin Layout */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/parents" element={<AdminTuteurs />} />
              <Route path="/activities" element={<AdminActivities />} />
              <Route path="/news" element={<AdminNews />} />
              <Route path="/partners" element={<AdminPartners />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="/admins" element={<AdminAdmins />} />
              <Route path="/media" element={<AdminImages />} />
              <Route path="/static-pages/add" element={<AddStaticPage />} /> {/* New route for adding */}
              <Route path="/static-pages/edit/:type/:id" element={<EditStaticPage />} /> {/* Modified route for editing */}
              <Route path="/static-pages" element={<AdminStaticPages />} />
              <Route path="/meetings" element={<AdminMeetings />} />
              <Route path="/activity-reports" element={<AdminActivityReports />} />
              <Route path="/finance" element={<AdminFinance />} />
              <Route path="/interns" element={<AdminStagiaires />} />
              <Route path="/volunteers" element={<AdminVolunteers />} />

            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;