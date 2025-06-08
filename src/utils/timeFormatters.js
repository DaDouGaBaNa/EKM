import React from 'react';

export const formatDurationHHMMSS = (totalSeconds, showSign = false) => {
  if (isNaN(totalSeconds) || totalSeconds === null || totalSeconds === undefined) {
    return '00:00:00';
  }
  const absSeconds = Math.abs(totalSeconds);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = Math.floor(absSeconds % 60);
  
  const sign = totalSeconds < 0 ? '-' : (showSign ? '+' : '');

  if (hours === 0 && minutes === 0 && seconds < 60 && absSeconds < 60) {
     return `${sign}${String(seconds).padStart(2, '0')}s`;
  }
  if (hours === 0 && absSeconds < 3600) {
    return `${sign}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatDurationMMSS = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds === null || totalSeconds === undefined) {
    return '00:00';
  }
  const absSeconds = Math.abs(totalSeconds);
  const minutes = Math.floor(absSeconds / 60);
  const seconds = Math.floor(absSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatDurationToCustomFormat = (totalSeconds, formatType = 'HHMM') => {
  if (isNaN(totalSeconds) || totalSeconds === null || totalSeconds === undefined) {
    return formatType === 'HHMM' ? '0H00Min' : '0Min00Sec';
  }
  const absSeconds = Math.abs(totalSeconds);

  if (formatType === 'HHMM') {
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    return `${hours}H${String(minutes).padStart(2, '0')}Min`;
  } else if (formatType === 'MMSS') {
    const minutes = Math.floor(absSeconds / 60);
    const seconds = Math.floor(absSeconds % 60);
    return `${minutes}Min${String(seconds).padStart(2, '0')}Sec`;
  }
  return 'Invalid Format';
};


export const parseDurationHHMM = (hhmmString) => {
  const parts = hhmmString.split(':');
  if (parts.length === 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (!isNaN(hours) && !isNaN(minutes)) {
      return hours * 3600 + minutes * 60;
    }
  }
  return 0;
};

export const parseDurationMMSS = (mmssString) => {
  const parts = mmssString.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return minutes * 60 + seconds;
    }
  }
  return 0;
};
