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
  const [countPerRow, setCountPerRow] = useState(6)
  const [frameWidth, setFrameWidth] = useState(5)

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
    
    if (supportWallColor) {
      document.querySelector('header[role="banner"]').setAttribute('style', `background: var(--gw-wall-color);`)
      document.querySelector('main').setAttribute('style', `background: var(--gw-wall-color);`)

      // for product detail view
      if (document.querySelector('main').querySelector('div.bg-brand-300') !== null) {
        document.querySelector('main').querySelector('div.bg-brand-300').setAttribute('style', `background: var(--gw-wall-color);`)
        

        document.querySelector('main').querySelector('div.bg-brand-300').querySelectorAll('a > span > img').forEach(img => {
          img.setAttribute('style', `${ supportFrameColor ? 'border: var(--gw-frame-width) solid var(--gw-frame-color) !important;' : ''} box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.5) !important; ${img.getAttribute('style')}`);
        });
      }

      // for recently viewed carousel
      document.querySelectorAll('ul > li article div.absolute').forEach(article => {
        article.setAttribute('style', `${ supportFrameColor ? 'border: var(--gw-frame-width) solid var(--gw-frame-color); !important' : ''} box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.5) !important; ${article.getAttribute('style')}`);
      });

      const gridContainer = document.querySelector('.grid.w-full.gap-4');
      gridContainer.setAttribute('style', `grid-template-columns: repeat(var(--gw-count-per-row), minmax(0, 1fr)) !important;`)

      document.querySelectorAll('section').forEach((section) => {
        
        section.parentElement.setAttribute('style', `background: var(--gw-wall-color);`)

        // for filter/sort sticky
        if (section.parentElement.querySelector('div.sticky') !== null) {
          section.parentElement.querySelector('div.sticky').setAttribute('style', `background: var(--gw-wall-color);`)
        }
        const articles = section.querySelectorAll('article div.absolute');

        articles.forEach((article) => {
          article.setAttribute('style', `${ supportFrameColor ? 'border: var(--gw-frame-width) solid var(--gw-frame-color); !important' : ''} box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.5) !important; ${article.getAttribute('style')}`);
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
    document.documentElement.style.setProperty('--gw-wall-color', wallColor);
    document.documentElement.style.setProperty('--gw-frame-color', frameColor);
    document.documentElement.style.setProperty('--gw-count-per-row', countPerRow.toString());
    document.documentElement.style.setProperty('--gw-frame-width', `${frameWidth.toString()}px`);
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

        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Frame width</h4>
          <input
            type="number"
            className="text-right"
            value={frameWidth}
            onChange={(e) => setFrameWidth(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-5">
          <h4>Count per row</h4>
          <input
            type="number"
            className="text-right"
            value={countPerRow}
            onChange={(e) => setCountPerRow(Number(e.target.value))}
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
