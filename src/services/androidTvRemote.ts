/**
 * Spatial Navigation and Key Mapping Engine for Android TV Remotes
 * Supports standard D-Pad, OK/Center, Back, Media Play/Pause, Channel +/- and direct channel numbers.
 */

export interface SpatialNavigationOptions {
  containerSelector?: string;
  focusableSelector?: string;
  onBack?: () => void;
  onChannelChange?: (direction: 'next' | 'prev') => void;
  onPlayPause?: () => void;
}

/**
 * Android TV Key Code Mappings & standard keyboard equivalents
 */
export const TV_KEYS = {
  UP: ['ArrowUp', 'Up', '19', 'UIKeyInputUpArrow'],
  DOWN: ['ArrowDown', 'Down', '20', 'UIKeyInputDownArrow'],
  LEFT: ['ArrowLeft', 'Left', '21', 'UIKeyInputLeftArrow'],
  RIGHT: ['ArrowRight', 'Right', '22', 'UIKeyInputRightArrow'],
  ENTER: ['Enter', 'Select', '13', '23', 'Space', ' '],
  BACK: ['Escape', 'Back', 'BrowserBack', '27', '4', 'GoBack', 'Backspace'],
  PLAY_PAUSE: ['MediaPlayPause', 'Play', 'Pause', '179', '85', 'k', 'K'],
  NEXT_TRACK: ['MediaTrackNext', 'MediaFastForward', '176', '87', 'l', 'L'],
  PREV_TRACK: ['MediaTrackPrevious', 'MediaRewind', '177', '88', 'j', 'J'],
  CH_UP: ['ChannelUp', 'PageUp', '33', '166', 'w', 'W'],
  CH_DOWN: ['ChannelDown', 'PageDown', '34', '167', 's', 'S'],
  VOL_UP: ['AudioVolumeUp', 'VolumeUp', '175', '+', '='],
  VOL_DOWN: ['AudioVolumeDown', 'VolumeDown', '174', '-'],
  MUTE: ['AudioVolumeMute', 'VolumeMute', '173', '164', 'm', 'M'],
};

/**
 * Calculates Euclidean distance between two bounding rectangles in a given direction
 */
function getDistanceInDirection(
  fromRect: DOMRect,
  toRect: DOMRect,
  direction: 'up' | 'down' | 'left' | 'right'
): number {
  const fromCenter = {
    x: fromRect.left + fromRect.width / 2,
    y: fromRect.top + fromRect.height / 2,
  };
  const toCenter = {
    x: toRect.left + toRect.width / 2,
    y: toRect.top + toRect.height / 2,
  };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // Verify element is in the targeted direction
  if (direction === 'up' && dy >= -2) return Infinity;
  if (direction === 'down' && dy <= 2) return Infinity;
  if (direction === 'left' && dx >= -2) return Infinity;
  if (direction === 'right' && dx <= 2) return Infinity;

  // Weight primary direction vs orthogonal axis
  if (direction === 'up' || direction === 'down') {
    return Math.abs(dy) + Math.abs(dx) * 1.8;
  } else {
    return Math.abs(dx) + Math.abs(dy) * 1.8;
  }
}

/**
 * Finds the best next element to focus using 2D spatial layout
 */
export function findNextFocusable(
  currentElement: HTMLElement | null,
  direction: 'up' | 'down' | 'left' | 'right',
  selector = '.tv-focusable, button:not([disabled]), a[href]:not([disabled]), input:not([disabled]), [tabindex="0"]'
): HTMLElement | null {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    // Exclude elements inside hidden parents or remote simulator itself
    if (el.closest('.tv-remote-ignore')) return false;

    const rect = el.getBoundingClientRect();
    const isVisible =
      rect.width > 0 &&
      rect.height > 0 &&
      window.getComputedStyle(el).display !== 'none' &&
      window.getComputedStyle(el).visibility !== 'hidden' &&
      rect.bottom >= 0 &&
      rect.top <= window.innerHeight &&
      rect.right >= 0 &&
      rect.left <= window.innerWidth;
    const isEnabled = !el.hasAttribute('disabled');
    return isVisible && isEnabled;
  });

  if (elements.length === 0) return null;

  if (!currentElement || !document.contains(currentElement)) {
    return elements[0];
  }

  const currentRect = currentElement.getBoundingClientRect();
  let closestElement: HTMLElement | null = null;
  let minDistance = Infinity;

  for (const el of elements) {
    if (el === currentElement) continue;

    const targetRect = el.getBoundingClientRect();
    const distance = getDistanceInDirection(currentRect, targetRect, direction);

    if (distance < minDistance) {
      minDistance = distance;
      closestElement = el;
    }
  }

  return closestElement;
}

/**
 * Focuses an element smoothly and centers it in view for TV 10-foot experience
 */
export function focusTvElement(el: HTMLElement | null) {
  if (!el) return;
  el.focus();
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });
}

/**
 * Simulates an Android TV Remote key press event
 */
export function simulateTvRemoteKey(keyName: string) {
  const event = new KeyboardEvent('keydown', {
    key: keyName,
    code: keyName,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(event);
}
