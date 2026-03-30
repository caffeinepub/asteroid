# Asteroid - Real Device Capabilities

## Current State
The app has three modes (Standard, GravityMode, EarthMode) and a voice panel. These modes currently use simulated/mock data: GravityMode shows a camera placeholder with no real camera; EarthMode uses hardcoded GPS data; VoicePanel uses a simulated recognition timeout; no haptic feedback.

## Requested Changes (Diff)

### Add
- Real microphone access via Web Speech API (SpeechRecognition) for voice input
- Real text-to-speech via Web Speech Synthesis API for voice output
- Real camera access via getUserMedia for GravityMode (rear camera preferred)
- Real GPS via navigator.geolocation.watchPosition for EarthMode
- Haptic feedback via navigator.vibrate for key actions
- Permission request UI with graceful error messages if denied

### Modify
- VoicePanel: replace mock speech with real SpeechRecognition + SpeechSynthesis
- GravityMode: replace camera placeholder with live getUserMedia video stream
- EarthMode: replace hardcoded coords with live geolocation; show real lat/lng and heading
- Settings: show permission status for mic, camera, location

### Remove
- Hardcoded/simulated location data in EarthMode
- Fake speech recognition timeout in VoicePanel

## Implementation Plan
1. VoicePanel: wire up window.SpeechRecognition, continuous mode, interim results, error handling
2. VoicePanel: wire up window.speechSynthesis to speak AI responses
3. GravityMode: getUserMedia with facingMode environment, stream to video element
4. EarthMode: watchPosition for live coords, display and announce changes via TTS
5. navigator.vibrate on voice start, mode changes, task complete
6. Graceful fallback messages for unsupported browsers or denied permissions
