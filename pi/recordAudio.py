import pyaudio
import wave
p = pyaudio.PyAudio()

print(p.get_default_input_device_info())

FRAMES_PERBUFF = 5096 # number of frames per buffer
FORMAT = pyaudio.paInt16 # 16 bit int
CHANNELS = 1 # I guess this is for mono sounds
FRAME_RATE = 44100 # sample rate


stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=FRAME_RATE,
                input=True,
                frames_per_buffer=FRAMES_PERBUFF) #buffer

frames = []
RECORD_SECONDS = 5
nchunks = int(RECORD_SECONDS * FRAME_RATE / FRAMES_PERBUFF)
for i in range(0, nchunks):
    try:
        data = stream.read(FRAMES_PERBUFF)
        frames.append(data) # 2 bytes(16 bits) per channel
    except IOError as ex:
        print(ex);
        
print(map(ord, frames[1][:20]))
print("* done recording")
stream.stop_stream()
stream.close()
wf = wave.open('recorded_audio.wav', 'wb')
wf.setnchannels(CHANNELS)
wf.setsampwidth(p.get_sample_size(FORMAT))
wf.setframerate(FRAME_RATE)
wf.writeframes(b''.join(frames))
wf.close()
p.terminate()