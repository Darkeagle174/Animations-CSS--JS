import mido
from midi2audio import FluidSynth
import os

# Define notes and their corresponding MIDI numbers
NOTE_TO_MIDI = {
    "C4": 60, "C#4": 61, "D4": 62, "D#4": 63, "E4": 64, "F4": 65, "F#4": 66,
    "G4": 67, "G#4": 68, "A4": 69, "A#4": 70, "B4": 71,
    "C5": 72, "C#5": 73, "D5": 74, "D#5": 75, "E5": 76, "F5": 77, "F#5": 78,
    "G5": 79, "G#5": 80
}

# Set durations and soundfont
DURATION = 2  # seconds per note
SOUNDFONT = "FluidR3_GM.sf2"  # Path to your SoundFont file
fs = FluidSynth(SOUNDFONT)

# Output directory for the .wav files
output_dir = "piano_notes"
os.makedirs(output_dir, exist_ok=True)

# Generate and save each note
for note, midi_number in NOTE_TO_MIDI.items():
    # Create a MIDI file for the note
    midi_filename = f"{note}.mid"
    midi = mido.MidiFile()
    track = mido.MidiTrack()
    midi.tracks.append(track)

    # Add MIDI messages (note on and off)
    track.append(mido.Message('note_on', note=midi_number, velocity=100, time=0))
    track.append(mido.Message('note_off', note=midi_number, velocity=100, time=int(DURATION * 1000)))

    # Save the MIDI file
    midi.save(midi_filename)

    # Convert MIDI to WAV using the soundfont
    wav_filename = os.path.join(output_dir, f"{note}.wav")
    fs.midi_to_audio(midi_filename, wav_filename)
    print(f"Saved: {wav_filename}")

    # Remove the intermediate MIDI file
    os.remove(midi_filename)

print("All piano notes generated and saved!")
