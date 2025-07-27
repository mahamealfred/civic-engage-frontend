import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import {
  Navbar,
  Footer,
  Sidebar,
  ThemeSettings
} from './components';

import {
  Dashboard, Orders, Calendar, Employees, Stacked, Pyramid, Customers,
  Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping,
  Editor, Login, SignUp, LandingPage, Issues, NewIssueForm, NewUserForm,
  Asign, Inprogress, Opened, Rejected, Solved, Category, Department,
  Feedback, NewCategoryForm
} from './pages';

import './App.css';
import { ContextProvider, useStateContext } from './contexts/ContextProvider';
import PrivateRoute from './PrivateRoute';
import NewDepartmentForm from './pages/NewDepartement';

const Layout = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
    userRole
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  if (!userRole) return null; // Don’t render layout until userRole is available

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className="flex relative dark:bg-main-dark-bg">
        {/* Floating Settings Button */}
        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>

        {/* Sidebar */}
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div
          className={
            activeMenu
              ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
              : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>

          {themeSettings && <ThemeSettings />}

          <div className="mt-5">
            <Routes>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Pages */}
              <Route path="/issues" element={<Issues />} />
              <Route path="/new-issues" element={<NewIssueForm />} />
              <Route path="/new-user" element={<NewUserForm />} />
              <Route path="/new-department" element={<NewDepartmentForm />} />
              <Route path="/survey" element={<Employees />} />
              <Route path="/users" element={<Customers />} />
              <Route path="/asign/:issueId" element={<Asign />} />
              <Route path="/inprogress" element={<Inprogress />} />
              <Route path="/opened" element={<Opened />} />
              <Route path="/rejected" element={<Rejected />} />
              <Route path="/solved" element={<Solved />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/departments" element={<Department />} />
              <Route path="/feedbacks" element={<Feedback />} />
              <Route path="/new-category" element={<NewCategoryForm />} />

              {/* Apps */}
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/message/:issueId" element={<Editor />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/color-picker" element={<ColorPicker />} />

              {/* Charts */}
              <Route path="/line" element={<Line />} />
              <Route path="/area" element={<Area />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/Issue_Status" element={<Pie />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/color-mapping" element={<ColorMapping />} />
              <Route path="/pyramid" element={<Pyramid />} />
              <Route path="/stacked" element={<Stacked />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<PrivateRoute><Layout /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;
