import React, { useState, useRef, useEffect, useCallback } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BlockSidebar from "./components/BlockSidebar";
import ScriptArea from "./components/ScriptArea";
import Canvas from "./components/Canvas";
import PlayButton from "./components/PlayButton";
import ResetButton from "./components/ResetButton";
import HeroFeatureCheckbox from "./components/HeroFeatureCheckbox";
import "./App.css";
import "./index.css";

const initialSpritePositions = {};
const SPRITE_DIMENSION = 48;

function getSprite(idx, name, image) {
  const defaultX = 60 + (Object.keys(initialSpritePositions).length % 2 === 0 ? 0 : 400);
  const defaultY = 60;
  const id = Date.now() + Math.floor(Math.random() * 10000);

  if (!initialSpritePositions[id]) {
    initialSpritePositions[id] = { x: defaultX, y: defaultY, direction: 0 };
  }

  return {
    id: id,
    name: name,
    x: defaultX,
    y: defaultY,
    image: image,
    direction: 0,
    message: null,
    messageType: null
  };
}

function checkCollision(spriteA, spriteB, dimension) {
  const aLeft = spriteA.x;
  const aRight = spriteA.x + dimension;
  const aTop = spriteA.y;
  const aBottom = spriteA.y + dimension;

  const bLeft = spriteB.x;
  const bRight = spriteB.x + dimension;
  const bTop = spriteB.y;
  const bBottom = spriteB.y + dimension;

  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

export default function App() {
  const spriteOptions = [
    { name: "Freeza", image: process.env.PUBLIC_URL + "/sprite_models/freeza.png" },
    { name: "Goku", image: process.env.PUBLIC_URL + "/sprite_models/goku.png" }
  ];
  const [sprites, setSprites] = useState([]);
  const [spriteScripts, setSpriteScripts] = useState({});
  const [selectedSpriteIdx, setSelectedSpriteIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isHeroFeatureEnabled, setIsHeroFeatureEnabled] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  const isPausedRef = useRef(isPaused);
  const spritesRef = useRef(sprites);
  const isHeroFeatureEnabledRef = useRef(isHeroFeatureEnabled);
  const activeSwapRef = useRef(null);

  useEffect(() => {

    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
  
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    spritesRef.current = sprites;
  }, [sprites]);

  useEffect(() => {
    isHeroFeatureEnabledRef.current = isHeroFeatureEnabled;
  }, [isHeroFeatureEnabled]);

  const handleCollisionAndSwapScripts = useCallback((sprite1Id, sprite2Id) => {
    const pairKey = [sprite1Id, sprite2Id].sort().join('-');
    

    if (activeSwapRef.current === pairKey) {
      
      return false; 
    }
    activeSwapRef.current = pairKey;
    console.log(`[HCASS] Locked for pair: ${pairKey}. Initiating new swap.`);

    console.log("[HCASS] Setting isPlayingRef.current = false, setIsPlaying(false), setIsPaused(false)");
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);

    setSpriteScripts(prevScripts => {
      console.log("[HCASS] Swapping scripts in setSpriteScripts.");
      const scriptsS1Original = [...(prevScripts[sprite1Id] || [])];
      const scriptsS2Original = [...(prevScripts[sprite2Id] || [])];
      const newScriptsForS1 = [...scriptsS2Original];
      const newScriptsForS2 = [...scriptsS1Original];

      if (JSON.stringify(prevScripts[sprite1Id]) === JSON.stringify(newScriptsForS1) &&
          JSON.stringify(prevScripts[sprite2Id]) === JSON.stringify(newScriptsForS2)) {
        return prevScripts;
      }
      return {
        ...prevScripts,
        [sprite1Id]: newScriptsForS1,
        [sprite2Id]: newScriptsForS2,
      };
    });

    console.log("[HCASS] Scheduling setIsPlaying(true) in 1000ms.");
    setTimeout(() => {
      console.log("[HCASS][TIMEOUT_1s] setIsPlaying(true) now. Releasing lock in another 2000ms.");
      setIsPlaying(true);

      setTimeout(() => {
        if (activeSwapRef.current === pairKey) {
          console.log(`[HCASS][TIMEOUT_3s] Releasing lock for pair: ${pairKey}`);
          activeSwapRef.current = null;
        } else {
          console.log(`[HCASS][TIMEOUT_3s] Lock for pair ${pairKey} was already released or changed. Current: ${activeSwapRef.current}`);
        }
      }, 2000);
    }, 1000);
    console.log(`[HCASS] Initiated new swap for ${pairKey}. Returning true.`);
    return true; // Indicate a new swap was initiated
  }, [setSpriteScripts, setIsPlaying, setIsPaused]);

  const executeScript = useCallback(async (spriteId, scriptToExecute, initialSpriteState, setSpritesDirectly, getIsPaused, getIsPlaying) => {
    const scriptSummary = scriptToExecute.map(b => b.actionId || b.label).join(', ') || 'EMPTY';
    console.log(`[executeScript] Sprite ID: ${spriteId}. Script: [${scriptSummary}]. isPlaying: ${getIsPlaying()}. isPaused: ${getIsPaused()}`);
    let modifiedSpriteState = { ...initialSpriteState };
    const repeatEntireScriptCount = 10;
    const INTER_REPETITION_DELAY = 30;
    const MOTION_BLOCK_PAUSE = 1000;

    for (let r = 0; r < repeatEntireScriptCount; r++) {
      if (!getIsPlaying()) {
        console.log(`[executeScript] Sprite ID: ${spriteId}. Loop ${r}. Not playing. Returning.`);
        return modifiedSpriteState;
      }
      while (getIsPaused()) {
        // Corrected: This loop should only wait if paused.
        // The block processing logic is outside this loop.
        if (!getIsPlaying()) {
          console.log(`[executeScript] Sprite ID: ${spriteId}. Paused & then stopped. Returning.`);
          return modifiedSpriteState;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

     
      for (const block of scriptToExecute) { 
        if (!getIsPlaying()) {
          console.log(`[executeScript] Sprite ID: ${spriteId}. Block processing. Not playing. Returning.`);
          return modifiedSpriteState;
        }
        while (getIsPaused()) {
          if (!getIsPlaying()) {
            console.log(`[executeScript] Sprite ID: ${spriteId}. Block processing, paused & then stopped. Returning.`);
            return modifiedSpriteState;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const actionId = block.actionId;
        const inputs = block.inputs;

        switch (actionId) {
          case "move":
            const totalSteps = parseFloat(inputs[0].value) || 0;
            if (totalSteps === 0) break;
            const angleRadMove = modifiedSpriteState.direction * (Math.PI / 180);
            const subStepMaxMagnitude = Math.min(SPRITE_DIMENSION / 2, 10);
            let accumulatedSteps = 0;
            while (Math.abs(accumulatedSteps) < Math.abs(totalSteps)) {
                if (!getIsPlaying()) return modifiedSpriteState;
                while (getIsPaused()) {
                    if (!getIsPlaying()) return modifiedSpriteState;
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                const remainingStepsToBlockCompletion = totalSteps - accumulatedSteps;
                const currentSubStepMagnitude = Math.min(subStepMaxMagnitude, Math.abs(remainingStepsToBlockCompletion));
                const currentSubStep = Math.sign(totalSteps) * currentSubStepMagnitude;
                modifiedSpriteState.x += currentSubStep * Math.cos(angleRadMove);
                modifiedSpriteState.y -= currentSubStep * Math.sin(angleRadMove);
                accumulatedSteps += currentSubStep;
                setSpritesDirectly(prevSprites =>
                    prevSprites.map(s => s.id === spriteId ? { ...s, ...modifiedSpriteState } : s)
                );
                if (isHeroFeatureEnabledRef.current && spritesRef.current.length === 2) {
                    const currentSpriteStateForCheck = { ...modifiedSpriteState, id: spriteId };
                    const otherSprite = spritesRef.current.find(s => s.id !== spriteId);
                    if (otherSprite) {
                        const collisionResult = checkCollision(currentSpriteStateForCheck, otherSprite, SPRITE_DIMENSION);
                        if (collisionResult) {
                          console.log(`[executeScript] Collision detected for ${spriteId} with ${otherSprite.id} during move.`);
                          const swapInitiated = handleCollisionAndSwapScripts(spriteId, otherSprite.id);
                          if (swapInitiated) {
                            console.log(`[executeScript] Swap initiated by move for ${spriteId}. Terminating script.`);
                            return modifiedSpriteState;
                          }
                          console.log(`[executeScript] Swap NOT initiated (lock active) for ${spriteId} during move. Continuing script.`);
                        }
                    }
                }
                if (Math.abs(accumulatedSteps) < Math.abs(totalSteps)) {
                     await new Promise(resolve => setTimeout(resolve, 16));
                }
            }
            break;
          case "turn_cw":
            const degreesCw = parseFloat(inputs[0].value) || 0;
            modifiedSpriteState.direction = (modifiedSpriteState.direction - degreesCw + 360) % 360;
            break;
          case "turn_ccw":
            const degreesCcw = parseFloat(inputs[0].value) || 0;
            modifiedSpriteState.direction = (modifiedSpriteState.direction + degreesCcw) % 360;
            break;
          case "goto_xy":
            const targetX = parseFloat(inputs[1].value) || 0;
            const targetY = parseFloat(inputs[3].value) || 0;
            let blockStartX = modifiedSpriteState.x;
            let blockStartY = modifiedSpriteState.y;
            const deltaXTotal = targetX - blockStartX;
            const deltaYTotal = targetY - blockStartY;
            const totalDistance = Math.sqrt(deltaXTotal * deltaXTotal + deltaYTotal * deltaYTotal);
            if (totalDistance === 0) break;
            const gotoSubStepMaxMagnitude = Math.min(SPRITE_DIMENSION / 2, 10);
            let distanceTraveled = 0;
            while (distanceTraveled < totalDistance) {
                if (!getIsPlaying()) return modifiedSpriteState;
                while (getIsPaused()) {
                     if (!getIsPlaying()) return modifiedSpriteState;
                     await new Promise(resolve => setTimeout(resolve, 100));
                }
                const remainingDistanceForBlock = totalDistance - distanceTraveled;
                const currentSubStepDistance = Math.min(gotoSubStepMaxMagnitude, remainingDistanceForBlock);
                const fractionOfTotalPathForSubStep = currentSubStepDistance / totalDistance;
                modifiedSpriteState.x += deltaXTotal * fractionOfTotalPathForSubStep;
                modifiedSpriteState.y += deltaYTotal * fractionOfTotalPathForSubStep;
                distanceTraveled += currentSubStepDistance;
                setSpritesDirectly(prevSprites =>
                    prevSprites.map(s => s.id === spriteId ? { ...s, ...modifiedSpriteState } : s)
                );
                if (isHeroFeatureEnabledRef.current && spritesRef.current.length === 2) {
                    const currentSpriteStateForCheck = { ...modifiedSpriteState, id: spriteId };
                    const otherSprite = spritesRef.current.find(s => s.id !== spriteId);
                    if (otherSprite && checkCollision(currentSpriteStateForCheck, otherSprite, SPRITE_DIMENSION)) {
                        console.log(`[executeScript] Collision detected for ${spriteId} with ${otherSprite.id} during goto_xy.`);
                        const swapInitiated = handleCollisionAndSwapScripts(spriteId, otherSprite.id);
                        if (swapInitiated) {
                          console.log(`[executeScript] Swap initiated by goto_xy for ${spriteId}. Terminating script.`);
                          return modifiedSpriteState;
                        }
                        console.log(`[executeScript] Swap NOT initiated (lock active) for ${spriteId} during goto_xy. Continuing script.`);
                    }
                }
                if (distanceTraveled < totalDistance) {
                    await new Promise(resolve => setTimeout(resolve, 16));
                }
            }
            break;
          case "say_for_secs":
            const message = inputs[0].value;
            const durationSay = (parseFloat(inputs[2].value) || 0) * 1000;
            setSpritesDirectly(prevSprites => 
              prevSprites.map(s => s.id === spriteId ? { ...s, message: message, messageType: 'say' } : s)
            );
            await new Promise(resolve => setTimeout(resolve, durationSay));
            if (!getIsPlaying()) { return modifiedSpriteState; }
            while (getIsPaused()) {
              if (!getIsPlaying()) { return modifiedSpriteState; }
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            setSpritesDirectly(prevSprites => 
              prevSprites.map(s => s.id === spriteId ? { ...s, message: null, messageType: null } : s)
            );
            break;
          case "think_for_secs":
            const thought = inputs[0].value;
            const durationThink = (parseFloat(inputs[2].value) || 0) * 1000;
            setSpritesDirectly(prevSprites => 
              prevSprites.map(s => s.id === spriteId ? { ...s, message: thought, messageType: 'think' } : s)
            );
            await new Promise(resolve => setTimeout(resolve, durationThink));
            if (!getIsPlaying()) { return modifiedSpriteState; }
            while (getIsPaused()) {
              if (!getIsPlaying()) { return modifiedSpriteState; }
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            setSpritesDirectly(prevSprites => 
              prevSprites.map(s => s.id === spriteId ? { ...s, message: null, messageType: null } : s)
            );
            break;
          default:
        }

        setSpritesDirectly(prevSprites => 
          prevSprites.map(s => s.id === spriteId ? { ...s, ...modifiedSpriteState } : s)
        );

        if (["move", "turn_cw", "turn_ccw", "goto_xy"].includes(actionId)) {
          if (actionId !== "move" && actionId !== "goto_xy") {
             await new Promise(resolve => setTimeout(resolve, MOTION_BLOCK_PAUSE));
          }
        }
        
        if (!getIsPlaying()) {
            return modifiedSpriteState;
        }
        while (getIsPaused()) {
          if (!getIsPlaying()) {
            return modifiedSpriteState;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      if (r < repeatEntireScriptCount - 1) {
        if (!getIsPlaying()) {
            return modifiedSpriteState;
        }
        while (getIsPaused()) {
          if (!getIsPlaying()) {
            return modifiedSpriteState;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        await new Promise(resolve => setTimeout(resolve, INTER_REPETITION_DELAY));
      }
    }
    return modifiedSpriteState;
  }, [isHeroFeatureEnabledRef, spritesRef, handleCollisionAndSwapScripts]);

  const runAllSpriteScriptsInternal = useCallback(async () => {
    // Removed unused internalRunId
    if (!isPlayingRef.current) {
      console.log("[runAllSpriteScriptsInternal] Not playing. Returning early.");
      return;
    }
    console.log("[runAllSpriteScriptsInternal] Starting execution. isPlayingRef.current:", isPlayingRef.current);
    let currentSpritesExecutionState = JSON.parse(JSON.stringify(spritesRef.current));
    const executionPromises = [];

    for (let i = 0; i < currentSpritesExecutionState.length; i++) {
      const sprite = currentSpritesExecutionState[i];
      const scriptToExecute = spriteScripts[sprite.id];
      
      if (scriptToExecute && scriptToExecute.length > 0) {
        const promise = executeScript(
          sprite.id,
          scriptToExecute,
          sprite,
          setSprites,
          () => isPausedRef.current,
          () => isPlayingRef.current
        ).then(finalSpriteState => {
        }).catch(error => {
            console.error(`Error executing script for sprite ${sprite.id}:`, error);
        });
        executionPromises.push(promise);
      }
    }

    await Promise.all(executionPromises);

    if (isPlayingRef.current && !isPausedRef.current) {
        setIsPlaying(false);
    }
  }, [spriteScripts, spritesRef, setSprites, isPausedRef, isPlayingRef, setIsPlaying, executeScript]);

  const runAllSpriteScriptsRef = useRef(runAllSpriteScriptsInternal);

  useEffect(() => {
    runAllSpriteScriptsRef.current = runAllSpriteScriptsInternal;
  }, [runAllSpriteScriptsInternal]);

  useEffect(() => {
    const effectRunId = Date.now();
    console.log(`[EFFECT runScripts ID: ${effectRunId}] Triggered. isPlaying: ${isPlaying}, isPaused: ${isPaused}`);
    if (isPlaying && !isPaused) {
      console.log(`[EFFECT runScripts ID: ${effectRunId}] Conditions met. Calling runAllSpriteScriptsRef.current()`);
      runAllSpriteScriptsRef.current().catch(error => {
        console.error(`[EFFECT runScripts ID: ${effectRunId}] Error in runAllSpriteScripts:`, error);
        setIsPlaying(false);
        setIsPaused(false);
      });
    }
  }, [isPlaying, isPaused, spriteScripts, setIsPlaying, setIsPaused]);

  function handleSpriteMove(spriteId, newX, newY) {
    setSprites(prevSprites => 
      prevSprites.map(sprite => 
        sprite.id === spriteId ? { ...sprite, x: newX, y: newY } : sprite
      )
    );
  }

  function addSpriteByName(name) {
    if (sprites.length >= 2) return;
    var option = spriteOptions.find(opt => opt.name === name);
    if (!option) return;
    for (var i = 0; i < sprites.length; i++) {
      if (sprites[i].name === name) return;
    }

    const newSprite = getSprite(sprites.length, option.name, option.image);

    var newSprites = [...sprites, newSprite];
    setSprites(newSprites);

    var newScripts = { ...spriteScripts };
    newScripts[newSprite.id] = [];
    setSpriteScripts(newScripts);
    setSelectedSpriteIdx(newSprites.length - 1);
    setShowAddMenu(false);
  }

  function deleteSprite(idxToDelete) {
    if (sprites.length === 0 || idxToDelete < 0 || idxToDelete >= sprites.length) {
      return;
    }

    const spriteIdToDelete = sprites[idxToDelete].id;

    const newSprites = sprites.filter((sprite, index) => index !== idxToDelete);
    setSprites(newSprites);

    setSpriteScripts(prevScripts => {
      const updatedScripts = { ...prevScripts };
      delete updatedScripts[spriteIdToDelete];
      return updatedScripts;
    });

    delete initialSpritePositions[spriteIdToDelete];

    if (newSprites.length === 0) {
      setSelectedSpriteIdx(-1);
    } else if (selectedSpriteIdx === idxToDelete) {
      setSelectedSpriteIdx(Math.min(idxToDelete, newSprites.length - 1));
    } else if (selectedSpriteIdx > idxToDelete) {
      setSelectedSpriteIdx(prevIdx => prevIdx - 1);
    }
  }

  function handleDropBlock(spriteId, blockFromDrag) {
    var scripts = { ...spriteScripts };
    if (!scripts[spriteId]) scripts[spriteId] = [];
    scripts[spriteId].push(blockFromDrag);
    setSpriteScripts(scripts);
  }

  function handleUpdateBlock(spriteId, blockIndex, inputIndex, newValue) {
    setSpriteScripts(prevScripts => {
      const newScripts = { ...prevScripts };
      const specificScript = [...(newScripts[spriteId] || [])];
      if (specificScript[blockIndex] && specificScript[blockIndex].inputs[inputIndex]) {
        const updatedBlock = {
          ...specificScript[blockIndex],
          inputs: specificScript[blockIndex].inputs.map((input, idx) => 
            idx === inputIndex ? { ...input, value: newValue } : input
          )
        };
        specificScript[blockIndex] = updatedBlock;
        newScripts[spriteId] = specificScript;
        return newScripts;
      }
      return prevScripts;
    });
  }

  function handleDeleteBlock(spriteId, idx) {
    var scripts = {};
    for (var id in spriteScripts) {
      scripts[id] = spriteScripts[id].slice();
    }
    if (!scripts[spriteId]) return;
    scripts[spriteId].splice(idx, 1);
    setSpriteScripts(scripts);
  }

  async function handlePlayPauseToggle() {
    if (!isPlayingRef.current) {
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      setIsPaused(prevIsPaused => {
        return !prevIsPaused;
      });
    }
  }

  function handleReset() {
    setIsPlaying(false);
    setIsPaused(false);

    setSprites(prevSprites => 
      prevSprites.map(sprite => {
        const initialPos = initialSpritePositions[sprite.id];
        if (initialPos) {
          return {
            ...sprite,
            x: initialPos.x,
            y: initialPos.y,
            direction: initialPos.direction,
            message: null,
            messageType: null
          };
        }
        return sprite;
      })
    );
    setIsHeroFeatureEnabled(false);
  }

  function SpriteBar() {
    const presentNames = sprites.map(s => s.name);
    const addChoices = spriteOptions.filter(opt => !presentNames.includes(opt.name));
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white/90 border-b shadow relative">
        {sprites.map((sprite, idx) => (
          <div
            key={sprite.id}
            className={`flex flex-col items-center px-2 py-1 rounded border-2 cursor-pointer transition relative ${selectedSpriteIdx === idx ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50 hover:bg-blue-50"}`}
            onClick={() => setSelectedSpriteIdx(idx)}
            style={{ minWidth: 70 }}
          >
            <img src={sprite.image} alt={sprite.name} className="w-10 h-10 rounded-full border mb-1" />
            <span className="text-xs font-semibold mb-1">{sprite.name}</span>
            {sprites.length > 0 && (
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={e => { e.stopPropagation(); deleteSprite(idx); }}
                title="Delete Sprite"
              >
                🗑
              </button>
            )}
          </div>
        ))}
        {sprites.length < 2 && (
          <div className="relative">
            <button
              className="flex flex-col items-center justify-center px-4 py-2 border-2 border-dashed border-green-400 rounded bg-green-50 text-green-700 font-bold hover:bg-green-100 transition min-w-[70px]"
              onClick={() => setShowAddMenu(!showAddMenu)}
            >
              <span className="text-2xl">+</span>
              <span className="text-xs">Add</span>
            </button>
            {showAddMenu && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border rounded shadow p-2 flex gap-2 z-20">
                {addChoices.map(opt => (
                  <button
                    key={opt.name}
                    className="flex flex-col items-center px-2 py-1 hover:bg-blue-100 rounded"
                    onClick={() => addSpriteByName(opt.name)}
                  >
                    <img src={opt.image} alt={opt.name} className="w-8 h-8 rounded-full border mb-1" />
                    <span className="text-xs font-semibold">{opt.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function SpriteAreaList() {
    if (sprites.length === 0 || selectedSpriteIdx === -1) {
      return (
        <div className="flex flex-col items-center justify-center w-80 h-full text-gray-500">
          <p>No sprite selected.</p>
          <p>Add a sprite to start scripting!</p>
        </div>
      );
    }
    const selectedSprite = sprites[selectedSpriteIdx];
    if (!selectedSprite) {
       return (
        <div className="flex flex-col items-center justify-center w-80 h-full text-gray-500">
          <p>No sprite selected or sprite not found.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6 w-80">
        <div key={selectedSprite.id}>
          <h2 className="font-bold text-gray-700 mb-2">{selectedSprite.name} Area</h2>
          <ScriptArea
            blocks={spriteScripts[selectedSprite.id] || []}
            onDropBlock={block => handleDropBlock(selectedSprite.id, block)}
            onUpdateBlock={(blockIndex, inputIndex, value) => handleUpdateBlock(selectedSprite.id, blockIndex, inputIndex, value)}
            onDeleteBlock={idx => handleDeleteBlock(selectedSprite.id, idx)}
          />
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-200 font-sans select-none">
        <header className="bg-blue-600 text-white p-3 text-center shadow-md">
          <h1 className="text-2xl font-bold">MIT Scratch Clone</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <BlockSidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <SpriteBar />
            <div className="flex flex-1 overflow-hidden">
              <Canvas sprites={sprites} onSpriteMove={handleSpriteMove} />
              <SpriteAreaList /> 
            </div>
            <div className="p-2 bg-gray-100 border-t flex items-center justify-start space-x-2">
              <PlayButton isPlaying={isPlaying} isPaused={isPaused} onTogglePlayPause={handlePlayPauseToggle} />
              <ResetButton onReset={handleReset} />
              <HeroFeatureCheckbox isEnabled={isHeroFeatureEnabled} onToggle={() => setIsHeroFeatureEnabled(!isHeroFeatureEnabled)} />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
