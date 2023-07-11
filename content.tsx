import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type PlasmoCSConfig, type PlasmoGetOverlayAnchor } from 'plasmo';
import cssText from "data-text:~style.css"
 
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function Settings() {
  const [wallColor, setWallColor] = useState("#a0aec0")
  const [frameColor, setFrameColor] = useState("#000000")

  const draw = useCallback(() => {
    if (document.querySelector('main') === null) return;

    document.querySelector('main').setAttribute('style', `background: var(--gw-wall-color);`)

    const gridContainer = document.querySelector('.grid.w-full.gap-4');
    gridContainer.setAttribute('style', `grid-template-columns: repeat(6, minmax(0, 1fr)) !important;`)

    document.querySelectorAll('section').forEach((section) => {
      console.log('section', section);
      
      section.parentElement.setAttribute('style', `background: var(--gw-wall-color);`)
      const articles = section.querySelectorAll('article div.absolute');
      articles.forEach((article) => {
        article.setAttribute('style', `border: 5px solid var(--gw-frame-color); box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.5); ${article.getAttribute('style')}`);
      })
    });
  }, []);

  const paint = useCallback(({
    wallColor,
    frameColor,
  }) => {
    document.documentElement.style.setProperty('--gw-wall-color', wallColor);
    document.documentElement.style.setProperty('--gw-frame-color', frameColor);
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
    });
  }, [wallColor, frameColor]);

    
  // repaint when color changes
  useEffect(() => {
    paint({
      wallColor,
      frameColor,
    });
  }, [wallColor, frameColor]);
  

  return (
    <div className="fixed top-5 left-5">
      <div className="bg-white rounded-md p-5 shadow-md flex flex-col gap-3">
        <h2 className=" text-xl font-semibold">Settings</h2>
        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Wall color</h4>
          <input
            type="color"
            value={wallColor}
            onChange={(e) => setWallColor(e.target.value)}
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Frame color</h4>
          <input
            type="color"
            value={frameColor}
            onChange={(e) => setFrameColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default Settings

export const config: PlasmoCSConfig = {
  matches: ["https://desenio.ca/posters-prints/*", "https://desenio.com/*"],
  all_frames: true,
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
	  document.querySelector<HTMLElement>("main")
