/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as Preact from '../../../src/preact';
import {Arrow} from './arrow';
import {Scroller} from './scroller';
import {toChildArray, useRef, useState} from '../../../src/preact';
import {useMountEffect} from '../../../src/preact/utils';

/**
 * @param {!BaseCarouselDef.Props} props
 * @return {PreactDef.Renderable}
 */
export function BaseCarousel({
  arrowPrev,
  arrowNext,
  children,
  loop,
  onSlideChange,
  setAdvance,
  ...rest
}) {
  const childrenArray = toChildArray(children);
  const {length} = childrenArray;
  const [curSlide, setCurSlide] = useState(0);
  const advance = (dir) => {
    const container = scrollRef.current;
    // Modify scrollLeft is preferred to `setCurSlide` to enable smooth scroll.
    // Note: `setCurSlide` will still be called on debounce by scroll handler.
    container./* OK */ scrollLeft += container./* OK */ offsetWidth * dir;
  };
  useMountEffect(() => {
    if (setAdvance) {
      setAdvance(advance);
    }
  });

  const setRestingIndex = (i) => {
    setCurSlide(i);
    if (onSlideChange) {
      onSlideChange(i);
    }
  };
  const scrollRef = useRef(null);
  const disableForDir = (dir) =>
    !loop && (curSlide + dir < 0 || curSlide + dir >= length);
  return (
    <div {...rest}>
      <Scroller
        loop={loop}
        restingIndex={curSlide}
        setRestingIndex={setRestingIndex}
        scrollRef={scrollRef}
      >
        {childrenArray}
      </Scroller>
      <Arrow
        customArrow={arrowPrev}
        dir={-1}
        disabled={disableForDir(-1)}
        advance={() => advance(-1)}
      />
      <Arrow
        customArrow={arrowNext}
        dir={1}
        disabled={disableForDir(1)}
        advance={() => advance(1)}
      />
    </div>
  );
}
