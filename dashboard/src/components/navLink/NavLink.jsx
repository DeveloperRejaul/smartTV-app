import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowDown } from '../../assets/svg-icon';
import useAppSetParams from '../../hook/useAppSetParams';

/**
 * @param title string data type
 * @param children jsx
 * @param path string data type
 * @param ddw boolean data type, Dropdown icon
 * @param ddd array data, with Dropdown items
 * @returns jsx NavLink component
 */
function NavLinkCom({ title, children, path, ddw, ddd, end = true }) {
  const [hidden, setHidden] = useState(true);

  return (
    <div>
      <NavLink
        className={({ isActive }) => (isActive
          ? 'bg-tints-900 fill-white h-10 stroke-white flex font-NunitoSans space-x-4  text-wight-900  font-medium justify-between py-1 px-2 '
          : 'font-NunitoSans h-10 fill-tints-900 stroke-tints-900 px-2 justify-between flex bg-wight-900 text-tints-900 space-x-4 font-medium')}
        to={path}
        end={end}
      >
        <div className='flex items-center space-x-2'>
          {children}
          <span>{title}</span>
        </div>
        <div onClick={() => setHidden(!hidden)}>{ddw ? <ArrowDown /> : <div />}</div>
      </NavLink>

      {/* drop down */}
      {ddd && (
        <ul className='text-black-50 ml-9   '>
          {ddd.map((e) => hidden || (
            <NavLink
              key={Math.random()}
              to={e.to}
              className={({ isActive }) => `text-tints-900 block  my-1 py-1 px-2 rounded hover:bg-tints-50 ${isActive ? 'bg-tints-50' : 'bg-white'}`}
            >
              <li>
                {e.text}
              </li>
            </NavLink>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NavLinkCom;
