import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {MainNavigation} from "@codegouvfr/react-dsfr/MainNavigation";
import { useTranslation, declareComponentKeys } from "i18n";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [searchParams] = useSearchParams();
  const {t} = useTranslation({Navigation});

  // Function to sync URL with parent HF page
  const syncUrlWithParent = (queryString: any, hash:any) => {
    // Check if we're in an HF Space iframe
    const isHFSpace = window.location !== window.parent.location;
    if (isHFSpace) {
      try {
        // Build complete URL with hash
        const fullPath = `${queryString}${hash ? "#" + hash : ""}`;
        window.parent.postMessage(
          {
            type: "urlUpdate",
            path: fullPath,
          },
          "https://huggingface.co"
        );
      } catch (e) {
        console.warn("Unable to sync URL with parent:", e);
      }
    }
  };

  const handleNavigation = (index:any, path:any) => (e:any) => {
    e.preventDefault();
    const searchString = searchParams.toString();
    const queryString = searchString ? `?${searchString}` : "";
    const newPath = `${path}${queryString}`;

    // Local navigation via React Router
    navigate(newPath);

    // If in HF Space, sync with parent
    if (window.location !== window.parent.location) {
      syncUrlWithParent(queryString, newPath);
    }
    setActive(index);
  };

  return (
    <MainNavigation 
        items={[
            {
                isActive: active === 0,
                linkProps: {
                    href: "/",
                    target: '_self',
                    onClick: handleNavigation(0, "/")
                },
                text: "Leaderboard",
            },
            {
                isActive: active === 1,
                linkProps: {
                    href: "/add",
                    target: '_self',
                    onClick: handleNavigation(1, "/add")
                },
                text: t("submit"),
            },
            {
                isActive: active === 2,
                linkProps: {
                    href: "/about",
                    target: '_self',
                    onClick: handleNavigation(2, "/about")
                },
                text: t("about"),
            },
            // {
            //     isActive: active === 2,
            //     linkProps: {
            //         href: "/vote",
            //         target: '_self',
            //         onClick: handleNavigation(2, "/vote")
            //     },
            //     text: "Vote for next model",
            // },
        ]}
    />
    );
        
            {/* Internal navigation */}
//             <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
//               <Box
//                 onClick={handleNavigation("/")}
//                 sx={linkStyle(location.pathname === "/")}
//               >
//                 Leaderboard
//               </Box>
//               <Box
//                 onClick={handleNavigation("/add")}
//                 sx={linkStyle(location.pathname === "/add")}
//               >
//                 Submit model
//               </Box>
//               <Box
//                 onClick={handleNavigation("/vote")}
//                 sx={linkStyle(location.pathname === "/vote")}
//               >
//                 Vote for next model
//               </Box>
//               <Box
//                 onClick={handleNavigation("/quote")}
//                 sx={linkStyle(location.pathname === "/quote")}
//               >
//                 Citations
//               </Box>
//             </Box>

//             <Separator />

//             {/* External links */}
//             <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
//               <MuiLink
//                 href="https://huggingface.co/spaces/open-llm-leaderboard/comparator"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 sx={{
//                   ...linkStyle(),
//                   "& svg": {
//                     fontSize: "0.75rem",
//                     ml: 0.5,
//                     opacity: 0.6,
//                     transition: "opacity 0.2s ease-in-out",
//                   },
//                   "&:hover svg": {
//                     opacity: 0.8,
//                   },
//                 }}
//               >
//                 Compare models
//                 <OpenInNewIcon />
//               </MuiLink>
//               <MuiLink
//                 href="https://huggingface.co/docs/leaderboards/open_llm_leaderboard/about"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 sx={{
//                   ...linkStyle(),
//                   "& svg": {
//                     fontSize: "0.75rem",
//                     ml: 0.5,
//                     opacity: 0.6,
//                     transition: "opacity 0.2s ease-in-out",
//                   },
//                   "&:hover svg": {
//                     opacity: 0.8,
//                   },
//                 }}
//               >
//                 About
//                 <OpenInNewIcon />
//               </MuiLink>
//             </Box>

//             <Separator />

//             {/* Dark mode toggle */}
//             <Tooltip
//               title={
//                 mode === "light"
//                   ? "Switch to dark mode"
//                   : "Switch to light mode"
//               }
//             >
//               <ButtonBase
//                 onClick={handleThemeToggle}
//                 sx={(theme) => ({
//                   color: "text.secondary",
//                   borderRadius: "100%",
//                   padding: 0,
//                   width: "36px",
//                   height: "36px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   transition: "all 0.2s ease-in-out",
//                   "&:hover": {
//                     color: "text.primary",
//                     backgroundColor: alpha(
//                       theme.palette.text.primary,
//                       theme.palette.mode === "dark" ? 0.1 : 0.06
//                     ),
//                   },
//                   "&.MuiButtonBase-root": {
//                     overflow: "hidden",
//                   },
//                   "& .MuiTouchRipple-root": {
//                     color: alpha(theme.palette.text.primary, 0.3),
//                   },
//                 })}
//               >
//                 {mode === "light" ? (
//                   <DarkModeOutlinedIcon sx={iconStyle} />
//                 ) : (
//                   <LightModeOutlinedIcon sx={iconStyle} />
//                 )}
//               </ButtonBase>
//             </Tooltip>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
};

const { i18n } = declareComponentKeys<
| "submit"
| "about"
>()({ Navigation });
export type I18n = typeof i18n;

export default Navigation;
