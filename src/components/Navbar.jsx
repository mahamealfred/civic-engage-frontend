import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useNavigate } from 'react-router-dom';

import avatar from '../data/avatar.jpg';
import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const navigate = useNavigate();
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  const auth = JSON.parse(localStorage.getItem('userData'));

  // Handle screen size on resize
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show/hide sidebar based on screen size
  useEffect(() => {
    if (screenSize !== undefined) {
      setActiveMenu(screenSize > 900);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    navigate('/');
  };

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      {/* Toggle Menu Button */}
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />

      <div className="flex items-center gap-4">
       

        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
             onClick={() => handleClick('userProfile')}
          >
            
          
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{' '}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {auth?.firstName || 'User'}
              </span>
              
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" >
              <span className="text-gray-400 font-bold ml-1 text-14">
                {auth?.role }
              </span>
            </MdKeyboardArrowDown>
          </div>
          
        </TooltipComponent>
 <button
          onClick={handleLogout}
          className="text-sm text-white-400 text-14 bg-green-400 px-4 py-2 rounded hover:bg-gray-600"
        >
          Logout
        </button>
        {/* Optional Logout Button */}
       

        {/* Conditional Panels */}
        {/* {isClicked.cart && <Cart />}
        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />} */}
      </div>
    </div>
  );
};

export default Navbar;
