import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type PlasmoCSConfig, type PlasmoGetOverlayAnchor } from 'plasmo';
import cssText from "data-text:~style.css"
 
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function Settings() {
  const [isVisible, setIsVisible] = useState(true);

  const [wallColor, setWallColor] = useState(localStorage.getItem('wallColor') || "#e3e3e3")
  const [frameColor, setFrameColor] = useState(localStorage.getItem('frameColor') || "#000000")
  const [countPerRow, setCountPerRow] = useState(Number(localStorage.getItem('countPerRow')) || 4)
  const [frameWidth, setFrameWidth] = useState(Number(localStorage.getItem('frameWidth')) || 5)

  console.log(wallColor, frameColor, countPerRow, frameWidth);
  

  const draw = useCallback(() => {
    if (document.querySelector('main') === null) return;

    const pathname = window.location.pathname;

    const supportWallColor = 
      pathname.includes('posters-prints') ||
      pathname.includes('poster') ||
      pathname.includes('new-in') ||
      pathname.includes('wishlist') ||
      pathname.includes('special-offer') ||
      pathname.includes('canvas') ||
      pathname.includes('frames') ||
      pathname.includes('home');

    const supportFrameColor =
       pathname.includes('posters-prints') ||
       pathname.includes('poster') ||
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

    const applyFullWidth = (element) => {
      if (!element) return;
      element.setAttribute('style', `max-width: 100% !important;`);
    }

    if (supportWallColor) {
      applyWallColor(document.querySelector('header[role="banner"]'))
      applyWallColor(document.querySelector('main'))
      
      // make it full width
      applyFullWidth(document.querySelector('main > div'));
      applyFullWidth(document.querySelector('.max-w-5xl'));

      // for product detail view
      const productHero = document.querySelector('main').querySelector('div.bg-brand-300');
      console.log(productHero);

      if (productHero != null) {
        applyWallColor(productHero)
        
        productHero.querySelectorAll('a > span > img').forEach(img => {
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
  
  if (!isVisible) return (
    <div className="fixed bottom-5 right-5 z-50">
      <button onClick={() => setIsVisible(true)} className=" bg-white px-4 py-2 border-2 border-black rounded-full text-sm cursor-pointer text-black font-semibold hover:underline">
        🎨 Show settings 
      </button>
    </div>
  )

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="relative bg-white border-2 border-black rounded-md p-5 shadow-xl flex flex-col gap-3">
        <div className="absolute top-1 right-1">
          <button onClick={() => setIsVisible(false)} className="underline text-sm cursor-pointer text-gray-500 hover:text-black">
            - Hide
          </button>
        </div>
        <h2 className=" text-xl font-semibold">Gallery Wall Settings</h2>
        <div className="flex flex-row justify-between items-center gap-3">
          <h4>Wall color</h4>
          <input
            className="rounded-xl w-6"
            type="color"
            value={wallColor}
            onChange={(e) => {
              setWallColor(e.target.value)
              localStorage.setItem('wallColor', e.target.value)
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          <h4>Frame color</h4>
          <input
            className="rounded-xl w-6"
            type="color"
            value={frameColor}
            onChange={(e) => {
              setFrameColor(e.target.value)
              localStorage.setItem('frameColor', e.target.value)
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          <h4>Frame width</h4>
          <div className="flex flex-row items-center gap-2">
            <button 
              disabled={frameWidth <= 0}
              className="p-2 rounded-full bg-gray-200"
              onClick={() => {
                setFrameWidth(frameWidth - 1)
                localStorage.setItem('frameWidth', `${frameWidth - 1}`)
              }}
            >-</button>
            <div>{frameWidth}</div>
            <button
              disabled={frameWidth >= 20}
              className="p-2 rounded-full bg-gray-200"
              onClick={() => {
                setFrameWidth(frameWidth + 1)
                localStorage.setItem('frameWidth', `${frameWidth + 1}`)
              }}
            >+</button>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          <h4>Count per row</h4>
          <div className="flex flex-row items-center gap-2">
            <button 
              disabled={countPerRow <= 0}
              className="p-2 rounded-full bg-gray-200"
              onClick={() => {
                setCountPerRow(countPerRow - 1)
                localStorage.setItem('countPerRow', `${countPerRow - 1}`)
              }}
            >-</button>
            <div>{countPerRow}</div>
            <button
              disabled={countPerRow >= 10}
              className="p-2 rounded-full bg-gray-200"
              onClick={() => {
                setCountPerRow(countPerRow + 1)
                localStorage.setItem('countPerRow', `${countPerRow + 1}`)
              }}
            >+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

export const config: PlasmoCSConfig = {
  matches: ["https://desenio.ca/*", "https://desenio.com/*", "https://desenio.eu/*", "https://desenio.co.uk/*"],
  all_frames: true,
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
	  document.querySelector<HTMLElement>("main")
