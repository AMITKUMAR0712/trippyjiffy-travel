import React, { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../Style/DropDown.module.scss";

const CategoryItem = memo(
  ({ cat, menuName, openRegion, setOpenRegion, slugify, toggleDropdown }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      setOpenRegion(openRegion === cat.id ? null : cat.id);

      if (menuName === "India Tours") {
        navigate(
          `/india-tours/${cat.id}/${slugify(cat.state_name || cat.name)}`
        );
        toggleDropdown(null);
      }
    };

    return (
      <li className={Style.DropItem}>
        {menuName === "India Tours" ? (
          <>
            <div className={Style.CategoryLink} onClick={handleClick}>
              {cat.name || "Unnamed Category"}
              <span
                style={{
                  transform:
                    openRegion === cat.id ? "rotate(180deg)" : "rotate(0)",
                  transition: "0.3s",
                }}
              ></span>
            </div>

            {openRegion === cat.id && cat.states && cat.states.length > 0 && (
              <ul className={Style.StateList}>
                {cat.states.map((state) => (
                  <li key={state.id}>
                    <Link
                      to={`/india-tours/state/${state.id}/${slugify(
                        state.state_name || state.name
                      )}`}
                      onClick={() => toggleDropdown(null)}
                    >
                      {state.state_name || state.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link to={cat.path} onClick={() => toggleDropdown(null)}>
            {cat.name}
          </Link>
        )}
      </li>
    );
  }
);

const DropDown = ({ navData, openDropdown, toggleDropdown }) => {
  const [openRegion, setOpenRegion] = useState(null);
  const slugify = (text) =>
    (text || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  return (
    <ul className={Style.NavList}>
      {navData.map((menu, index) => (
        <li
          key={index}
          className={`${Style.NavItem} ${menu.name === "India Tours"
            ? Style.IndiaNavItem
            : menu.name === "Asia Tours"
              ? Style.AsiaNavItem
              : ""
            }`}
          onMouseEnter={() => menu.categories && toggleDropdown(index)}
          onMouseLeave={() => menu.categories && toggleDropdown(null)}
        >
          <div
            className={`${Style.MenuLink} ${menu.name === "India Tours"
              ? Style.IndiaLink
              : menu.name === "Asia Tours"
                ? Style.AsiaLink
                : ""
              }`}
            onClick={(e) => {
              if (menu.categories) {
                e.preventDefault();
                toggleDropdown(index, true);
              }
            }}
          >
            {menu.categories ? (
              <span>{menu.name}</span>
            ) : (
              <Link to={menu.path}>{menu.name}</Link>
            )}
            {menu.categories && (
              <span
                className={`${Style.DropArrow} ${openDropdown === index ? Style.open : ""
                  } ${menu.name === "India Tours" ? Style.IndiaArrow : ""} ${menu.name === "Asia Tours" ? Style.AsiaArrow : ""
                  }`}
              >
                ▼
              </span>
            )}
          </div>

          {menu.categories && (
            <div
              className={`${Style.DropdownWrapper} ${menu.name === "India Tours"
                ? Style.IndiaWrapper
                : menu.name === "Asia Tours"
                  ? Style.AsiaWrapper
                  : Style.DefaultWrapper
                } ${openDropdown === index ? Style.showDropdown : ""}`}
              onMouseEnter={() => toggleDropdown(index)}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <ul className={Style.Dropdown}>
                {menu.categories.map((cat, category_index) => (
                  <CategoryItem
                    key={category_index}
                    cat={cat}
                    menuName={menu.name}
                    openRegion={openRegion}
                    setOpenRegion={setOpenRegion}
                    slugify={slugify}
                    toggleDropdown={toggleDropdown}
                    openDropdown={openDropdown}
                    index={index}
                  />
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default memo(DropDown);
