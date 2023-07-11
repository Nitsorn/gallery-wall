import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type PlasmoCSConfig, type PlasmoGetOverlayAnchor } from 'plasmo';
import cssText from "data-text:~style.css"
 
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function Settings() {

  const [wallColor, setWallColor] = useState(localStorage.getItem('wallColor') || "#e3e3e3")
  const [frameColor, setFrameColor] = useState(localStorage.getItem('frameColor') || "#000000")
  const [countPerRow, setCountPerRow] = useState(localStorage.getItem('countPerRow') || 4)
  const [frameWidth, setFrameWidth] = useState(Number(localStorage.getItem('frameWidth')) || 5)

  console.log(wallColor, frameColor, countPerRow, frameWidth);
  

  const draw = useCallback(() => {
    if (document.querySelector('main') === null) return;

    const pathname = window.location.pathname;

    const supportWallColor = 
      pathname.includes('posters-prints') ||
      pathname.includes('new-in') ||
      pathname.includes('wishlist') ||
      pathname.includes('special-offer') ||
      pathname.includes('canvas') ||
      pathname.includes('frames') ||
      pathname.includes('home');

    const supportFrameColor =
       pathname.includes('posters-prints') ||
       pathname.includes('new-in') ||
       pathname.includes('special-offer') ||
      pathname.includes('wishlist');

    const applyWallColor = (element) => {
      element.setAttribute('style', `background: var(--gw-wall-color);`)
    }

    const applyFrameColorAndShadow = (element) => {
      element.setAttribute('style', `box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.5) !important; ${element.getAttribute('style')}`);
      if (supportFrameColor) {
        element.setAttribute('style', `background-color: var(--gw-frame-color) !important; padding: var(--gw-frame-width) !important; ${element.getAttribute('style')}`);
        if (element.children[0]) {
          element.children[0].setAttribute('style', `box-shadow: inset 4px 4px 5px rgba(0,0,0,0.5) !important; ${element.children[0].getAttribute('style')}`);
        }
      }
    }
    
    if (supportWallColor) {
      applyWallColor(document.querySelector('header[role="banner"]'))
      applyWallColor(document.querySelector('main'))

      // for product detail view
      if (document.querySelector('main').querySelector('div.bg-brand-300') !== null) {
        applyWallColor(document.querySelector('main').querySelector('div.bg-brand-300'))
        

        document.querySelector('main').querySelector('div.bg-brand-300').querySelectorAll('a > span > img').forEach(img => {
          applyFrameColorAndShadow(img);
        });
      }

      // for recently viewed carousel
      document.querySelectorAll('ul > li article div.absolute').forEach(article => {
        applyFrameColorAndShadow(article);
      });

      const gridContainer = document.querySelector('.grid.w-full.gap-4');
      gridContainer.setAttribute('style', `grid-template-columns: repeat(var(--gw-count-per-row), minmax(0, 1fr)) !important;`)

      document.querySelectorAll('section').forEach((section) => {
        
        applyWallColor(section.parentElement)

        // for filter/sort sticky
        if (section.parentElement.querySelector('div.sticky') !== null) {
          applyWallColor(section.parentElement.querySelector('div.sticky'))
        }
        const articles = section.querySelectorAll('article div.absolute');

        articles.forEach((article) => {
          applyFrameColorAndShadow(article);
        })
      });
    }



  }, []);

  const paint = useCallback(({
    wallColor,
    frameColor,
    countPerRow,
    frameWidth,
  }) => {
    document.documentElement.style.setProperty('--gw-wall-color', localStorage.getItem('wallColor') || wallColor);
    document.documentElement.style.setProperty('--gw-frame-color', localStorage.getItem('frameColor') || frameColor);
    document.documentElement.style.setProperty('--gw-count-per-row', localStorage.getItem('countPerRow') || countPerRow);
    document.documentElement.style.setProperty('--gw-frame-width', `${localStorage.getItem('frameWidth') || frameWidth.toString()}px`);
  }, []);

  
  // initialize 
  useEffect(() => {
    initialize();
    

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'changedTab') {
          initialize();
        }
      }
    );

    return () => {
      chrome.runtime.onMessage.removeListener(
        function(request, sender, sendResponse) {
          // listen for messages sent from background.js
          if (request.message === 'changedTab') {
            initialize();
          }
        }
      );
    }
  }, []);

  const initialize = useCallback(() => {
    setTimeout(() => {
      draw();
    }, 3000);

    paint({
      wallColor,
      frameColor,
      countPerRow,
      frameWidth,
    });
  }, [wallColor, frameColor, countPerRow, frameWidth]);

    
  // repaint when color changes
  useEffect(() => {
    paint({
      wallColor,
      frameColor,
      countPerRow,
      frameWidth,
    });
  }, [wallColor, frameColor, countPerRow, frameWidth]);
  

  return (
    <div className="fixed top-5 left-5">
      <div className="bg-white rounded-md p-5 shadow-md flex flex-col gap-3">
        <h2 className=" text-xl font-semibold">Settings</h2>
        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Wall color</h4>
          <input
            type="color"
            value={wallColor}
            onChange={(e) => {
              setWallColor(e.target.value)
              localStorage.setItem('wallColor', e.target.value)
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Frame color</h4>
          <input
            type="color"
            value={frameColor}
            onChange={(e) => {
              setFrameColor(e.target.value)
              localStorage.setItem('frameColor', e.target.value)
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Frame width</h4>
          <input
            type="number"
            className="text-right"
            value={frameWidth}
            onChange={(e) => {
              setFrameWidth(Number(e.target.value))
              localStorage.setItem('frameWidth', e.target.value)
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Count per row</h4>
          <input
            type="number"
            className="text-right"
            value={countPerRow}
            onChange={(e) => {
              setCountPerRow(Number(e.target.value))
              localStorage.setItem('countPerRow', e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Settings

export const config: PlasmoCSConfig = {
  matches: ["https://desenio.ca/*", "https://desenio.com/*"],
  all_frames: true,
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
	  document.querySelector<HTMLElement>("main")
