import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminAuthLayout from './layouts/AdminAuthLayout';
import RequireAdmin from './components/Admin/RequireAdmin';
import Loading from './components/Loading';
import { AdminLoading } from './components/Admin/ui/AdminUI';

// Lazy-loaded Frontend Components
const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const SingleProject = lazy(() => import('./pages/Projects/SingleProject'));
const News = lazy(() => import('./pages/News/News'));
const SingleNews = lazy(() => import('./pages/News/SingleNews'));
const Activities = lazy(() => import('./pages/Activities/Activities'));
const SingleActivity = lazy(() => import('./pages/Activities/SingleActivity'));
const Participation = lazy(() => import('./pages/Participation/Participation'));
const Partners = lazy(() => import('./pages/Partners/Partners'));
const Photos = lazy(() => import('./pages/Photos/Photos'));
const Autisme = lazy(() => import('./pages/Autisme/Autisme'));
const SingleAutismePage = lazy(() => import('./pages/Autisme/SingleAutismePage'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const EditProfile = lazy(() => import('./pages/Auth/EditProfile'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const ObjectPage = lazy(() => import('./pages/Static/ObjectPage'));
const ClubPage = lazy(() => import('./pages/Static/ClubPage'));
const ClubMeetPage = lazy(() => import('./pages/Static/ClubMeetPage'));
const CentreAbout = lazy(() => import('./pages/CentreBalsam/CentreAbout'));
const ServicePath = lazy(() => import('./pages/CentreBalsam/ServicePath'));
const RegistrePath = lazy(() => import('./pages/CentreBalsam/RegistrePath'));
const PsychologicalSupport = lazy(() => import('./pages/CentreBalsam/PsychologicalSupport'));
const SpeechTherapy = lazy(() => import('./pages/CentreBalsam/SpeechTherapy'));
const MotorTherapy = lazy(() => import('./pages/CentreBalsam/MotorTherapy'));
const SpecialEducation = lazy(() => import('./pages/CentreBalsam/SpecialEducation'));
const Ergotherapy = lazy(() => import('./pages/CentreBalsam/Ergotherapy'));
const ProgramsAndActivities = lazy(() => import('./pages/CentreBalsam/ProgramsAndActivities'));
const DevenirStagiaire = lazy(() => import('./pages/CentreBalsam/DevenirStagiaire'));
const DevenirBenevole = lazy(() => import('./pages/CentreBalsam/DevenirBenevole'));
const TeamPage = lazy(() => import('./pages/CentreBalsam/TeamPage'));


// Lazy-loaded Admin Components
const AdminLogin = lazy(() => import('./pages/Auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminTuteurs = lazy(() => import('./pages/Admin/AdminTuteurs'));
const EditTuteur = lazy(() => import('./pages/Admin/EditTuteur'));
const AdminActivities = lazy(() => import('./pages/Admin/AdminActivities'));
const AddActivity = lazy(() => import('./pages/Admin/AddActivity')); // New import
const EditActivity = lazy(() => import('./pages/Admin/EditActivity')); // New import
const AdminNews = lazy(() => import('./pages/Admin/AdminNews'));
const AddNews = lazy(() => import('./pages/Admin/AddNews')); // New import
const EditNews = lazy(() => import('./pages/Admin/EditNews')); // New import
const AdminPartners = lazy(() => import('./pages/Admin/AdminPartners'));
const AdminSettings = lazy(() => import('./pages/Admin/AdminSettings'));
const AdminAdmins = lazy(() => import('./pages/Admin/AdminAdmins'));
const AdminImages = lazy(() => import('./pages/Admin/AdminImages'));
const AdminStaticPages = lazy(() => import('./pages/Admin/AdminStaticPages'));
const AddStaticPage = lazy(() => import('./pages/Admin/AddStaticPage'));
const EditStaticPage = lazy(() => import('./pages/Admin/EditStaticPage'));
const AdminMeetings = lazy(() => import('./pages/Admin/AdminMeetings'));
const AdminActivityReports = lazy(() => import('./pages/Admin/AdminActivityReports'));
const AdminFinance = lazy(() => import('./pages/Admin/AdminFinance'));
const AdminStagiaires = lazy(() => import('./pages/Admin/AdminStagiaires'));
const AdminVolunteers = lazy(() => import('./pages/Admin/AdminVolunteers'));
const AdminContactMessages = lazy(() => import('./pages/Admin/AdminContactMessages'));
const AdminMyProfile = lazy(() => import('./pages/Admin/AdminMyProfile'));



function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login - AdminAuthLayout with Suspense */}
        <Route path="/connecte" element={
          <AdminAuthLayout>
            <Suspense fallback={<Loading message="جاري تحميل صفحة الدخول..." />}>
              <AdminLogin />
            </Suspense>
          </AdminAuthLayout>
        } />

        {/* Public Routes - Main Layout with Suspense */}
        <Route path="*" element={
          <MainLayout>
            <Suspense fallback={<Loading />}>
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
                <Route path="/centre/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </MainLayout>
        } />

        {/* Admin Routes - Admin Layout with Suspense */}
        <Route path="/admin/*" element={
          <RequireAdmin>
            <AdminLayout>
              <Suspense fallback={<AdminLoading message="جاري تحميل لوحة التحكم..." />}>
                <Routes>
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/parents" element={<AdminTuteurs />} />
                  <Route path="/editTuteur/:enfantId" element={<EditTuteur />} />

                  {/* Activity Routes */}
                  <Route path="/activities" element={<AdminActivities />} />
                  <Route path="/activities/add" element={<AddActivity />} /> {/* New route */}
                  <Route path="/activities/edit/:id" element={<EditActivity />} /> {/* New route */}

                  {/* News Routes */}
                  <Route path="/news" element={<AdminNews />} />
                  <Route path="/news/add" element={<AddNews />} /> {/* New route */}
                  <Route path="/news/edit/:id" element={<EditNews />} /> {/* New route */}

                  <Route path="/partners" element={<AdminPartners />} />
                  <Route path="/settings" element={<AdminSettings />} />
                  <Route path="/admins" element={<RequireAdmin roles={['president']}><AdminAdmins /></RequireAdmin>} />
                  <Route path="/media" element={<AdminImages />} />
                  <Route path="/static-pages/add" element={<AddStaticPage />} />
                  <Route path="/static-pages/edit/:type/:id" element={<EditStaticPage />} />
                  <Route path="/static-pages" element={<AdminStaticPages />} />
                  <Route path="/meetings" element={<RequireAdmin roles={['president', 'secretary', 'vice_secretary']}><AdminMeetings /></RequireAdmin>} />
                  <Route path="/activity-reports" element={<RequireAdmin roles={['president', 'secretary', 'vice_secretary']}><AdminActivityReports /></RequireAdmin>} />
                  <Route path="/finance" element={<RequireAdmin roles={['president', 'treasurer', 'vice_treasurer']}><AdminFinance /></RequireAdmin>} />
                  <Route path="/interns" element={<AdminStagiaires />} />
                  <Route path="/volunteers" element={<AdminVolunteers />} />
                  <Route path="/contact-messages" element={<AdminContactMessages />} />
                  <Route path="/my-profile" element={<AdminMyProfile />} />
                </Routes>
              </Suspense>
            </AdminLayout>
          </RequireAdmin>
        } />
      </Routes>
    </Router>
  );
}

export default App;