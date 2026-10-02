/**
 * plugin-video-subtitle.js
 * Custom jsPsych 7 plugin: video playback with synchronized subtitle overlay
 *
 * - No controls (no play/pause/seek/speed/volume)
 * - Auto-advances to next trial when video ends
 * - Right-click disabled
 * - Subtitle overlay with lookback window
 */

var jsPsychVideoSubtitle = (function (jspsych) {
  'use strict';

  const info = {
    name: 'video-subtitle',
    parameters: {
      video_src: { type: jspsych.ParameterType.STRING, default: undefined },
      subtitle_words: { type: jspsych.ParameterType.OBJECT, default: [] },
      clip_label: { type: jspsych.ParameterType.STRING, default: '' },
      lookback_s: { type: jspsych.ParameterType.INT, default: 2 },
      instruction: { type: jspsych.ParameterType.STRING, default: '' },
      autoplay: { type: jspsych.ParameterType.BOOL, default: true },
      auto_advance: { type: jspsych.ParameterType.BOOL, default: true },
    },
  };

  class VideoSubtitlePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      const startTime = performance.now();

      display_element.innerHTML = `
        <div class="vsp-container">
          ${trial.clip_label ? `<div class="vsp-clip-label">${trial.clip_label}</div>` : ''}
          ${trial.instruction ? `<div class="vsp-instruction">${trial.instruction}</div>` : ''}
          <div class="vsp-video-wrap">
            <video id="vsp-video" width="960" height="540"
                   ${trial.autoplay ? 'autoplay' : ''}
                   playsinline disablePictureInPicture
                   controlsList="nodownload nofullscreen noremoteplayback noplaybackrate">
              <source src="${trial.video_src}" type="video/mp4">
            </video>
            <div id="vsp-subtitle" class="vsp-subtitle-overlay"></div>
          </div>
        </div>
      `;

      const video = display_element.querySelector('#vsp-video');
      const subtitleEl = display_element.querySelector('#vsp-subtitle');
      const words = trial.subtitle_words || [];

      // Disable all user interaction with video
      video.addEventListener('contextmenu', e => e.preventDefault());
      video.addEventListener('dblclick', e => e.preventDefault());
      // Lock playback rate
      video.playbackRate = 1.0;
      video.addEventListener('ratechange', () => { video.playbackRate = 1.0; });
      // Prevent seeking
      let lastTime = 0;
      video.addEventListener('timeupdate', () => {
        if (Math.abs(video.currentTime - lastTime) > 2) {
          video.currentTime = lastTime;
        }
        lastTime = video.currentTime;
      });

      // Subtitle rendering loop
      let rafId = null;
      let lastRenderedTime = -1;

      const renderSubtitles = () => {
        const ct = video.currentTime;
        if (Math.abs(ct - lastRenderedTime) < 0.05) {
          rafId = requestAnimationFrame(renderSubtitles);
          return;
        }
        lastRenderedTime = ct;

        const windowStart = ct - trial.lookback_s;
        const visible = words.filter(w => w.start >= windowStart && w.start <= ct);

        if (visible.length === 0) {
          subtitleEl.innerHTML = '';
        } else {
          const html = visible.map(w => {
            const opacity = 1 - Math.max(0, (ct - w.end) / trial.lookback_s) * 0.3;
            return `<span class="vsp-word" style="font-size:${w.font_size}pt;font-weight:${w.font_weight};opacity:${Math.max(0.5, opacity)}">${w.text} </span>`;
          }).join('');
          subtitleEl.innerHTML = html;
        }

        if (!video.ended) {
          rafId = requestAnimationFrame(renderSubtitles);
        }
      };

      video.addEventListener('play', () => {
        rafId = requestAnimationFrame(renderSubtitles);
      });

      video.addEventListener('ended', () => {
        if (rafId) cancelAnimationFrame(rafId);
        subtitleEl.innerHTML = '';

        const endTime = performance.now();
        const trialData = {
          video_src: trial.video_src,
          clip_label: trial.clip_label,
          video_duration: video.duration,
          rt: endTime - startTime,
        };

        if (trial.auto_advance) {
          // Auto-advance after 500ms pause
          setTimeout(() => {
            this.jsPsych.finishTrial(trialData);
          }, 500);
        }
      });
    }
  }

  VideoSubtitlePlugin.info = info;
  return VideoSubtitlePlugin;
})(jsPsychModule);
