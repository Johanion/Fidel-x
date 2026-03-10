import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import Svg, { Circle } from 'react-native-svg';

const Pomodoro = () => {
  const [studyTime, setStudyTime] = useState(30);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [mode, setMode] = useState('study');
  const [isRunning, setIsRunning] = useState(false);
  const [isRestMusicPlaying, setIsRestMusicPlaying] = useState(false);
  const [isStudyMusicPlaying, setIsStudyMusicPlaying] = useState(false);
  const [soundObj, setSoundObj] = useState(null);

  const totalTime = mode === 'study' ? studyTime * 60 : breakTime * 60;
  const progress = (totalTime - timeLeft) / totalTime;

  // Initialize audio
  useEffect(() => {
    Audio.setIsEnabledAsync(true);
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            const newMode = mode === 'study' ? 'break' : 'study';
            setMode(newMode);
            playAlarm(newMode);
            return (newMode === 'study' ? studyTime : breakTime) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [isRunning, mode, studyTime, breakTime]);

  // Play alarm sound
  const playAlarm = async (currentMode) => {
    const file = currentMode === 'study' 
      ? require('../../../assets/audio/study.mp3')
      : require('../../../assets/audio/rest.mp3');

    if (soundObj) {
      await soundObj.stopAsync();
      await soundObj.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(file);
    setSoundObj(sound);
    {mode==="study"?  setIsStudyMusicPlaying(true) : setIsRestMusicPlaying(true)}
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        if (mode==="study")
            setIsStudyMusicPlaying(false);
        }else if (mode==="rest")
            setIsRestMusicPlaying(false);
    });
  };

  const toggleMusic = async () => {
    if (!soundObj) return;
    const status = await soundObj.getStatusAsync();
    if (status.isPlaying) {
      await soundObj.pauseAsync();
      {mode==="study"?  setIsStudyMusicPlaying(false) : setIsRestMusicPlaying(false)}
    } else {
      await soundObj.playAsync();
      {mode==="study"?  setIsStudyMusicPlaying(true) : setIsRestMusicPlaying(true)}
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // const handleSetStudyTime = (value) => {
  //   const num = parseInt(value, 10);
  //   if (!isNaN(num) && num > 0) setStudyTime(num);
  // };

  // const handleSetBreakTime = (value) => {
  //   const num = parseInt(value, 10);
  //   if (!isNaN(num) && num > 0) setBreakTime(num);
  // };

  const startTimer = () => {
    setIsRunning(true);
    setMode('study');
    setTimeLeft(studyTime * 60);
  };

  const toggleRunning = () => setIsRunning(!isRunning);

  const stopTimer = async () => {
    setIsRunning(false);
    setTimeLeft(studyTime * 60);
    setMode('study');
    if (soundObj) {
      await soundObj.stopAsync();
      {mode==="study"?  setIsStudyMusicPlaying(false) : setIsRestMusicPlaying(false)}
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Focus</Text>

      <View style={styles.timerWrapper}>
        <Svg height="220" width="220" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e0e0e0"
            strokeWidth="5"
            fill="none"
          />
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke={mode === 'study' ? '#ff6347' : '#4caf50'}
            strokeWidth="5"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={283 * (1 - progress)}
            transform="rotate(-90 50 50)"
          />
        </Svg>
        <View style={styles.timerTextContainer}>
          <Text style={[styles.mode, mode==='study' ? {color:'#ff6347'} : {color:'#4caf50'}]}>
            {mode === 'study' ? 'Focus Time' : 'Break Time'}
          </Text>
          <Text style={styles.time}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Study (min)</Text>
          <TextInput
            placeholder="30"
            keyboardType="numeric"
            value={studyTime.toString()}
            onChangeText={(v) => setStudyTime(parseInt(v) || 0)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Break (min)</Text>
          <TextInput
            placeholder="5"
            keyboardType="numeric"
            value={breakTime.toString()}
            onChangeText={(v) => setBreakTime(parseInt(v) || 0)}
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor:isRunning?'#ffa500':'#ff6347'}]}
          onPress={toggleRunning}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{backgroundColor:'#4caf50'}]} onPress={startTimer}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{backgroundColor:'#9e9e9e'}]} onPress={stopTimer}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>

      {isStudyMusicPlaying && (
        <TouchableOpacity style={styles.musicButton} onPress={toggleMusic}>
          <Text style={styles.musicText}>{isStudyMusicPlaying ? 'Music On 🔊' : 'Music Off 🔇'}</Text>
        </TouchableOpacity>
      )}

      {isRestMusicPlaying && (
        <TouchableOpacity style={styles.musicButton} onPress={toggleMusic}>
          <Text style={styles.musicText}>{isRestMusicPlaying ? 'Music On 🔊' : 'Music Off 🔇'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Pomodoro;

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20,
    backgroundColor:'#f5f5f5',
  },
  title:{
    fontSize:30,
    fontWeight:'bold',
    color:'#333',
    marginBottom:30,
  },
  timerWrapper:{
    justifyContent:'center',
    alignItems:'center',
    marginBottom:40,
    shadowColor:'#000',
    shadowOpacity:0.15,
    shadowOffset:{width:0,height:6},
    shadowRadius:8,
    elevation:6,
    backgroundColor:'#fff',
    borderRadius:120,
    padding:10,
  },
  timerTextContainer:{
    position:'absolute',
    alignItems:'center',
  },
  mode:{
    fontSize:18,
    fontWeight:'bold',
    marginBottom:6,
  },
  time:{
    fontSize:42,
    fontWeight:'bold',
    color:'#333',
  },
  inputContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    marginBottom:30,
  },
  inputGroup:{
    flex:1,
    marginHorizontal:8,
  },
  inputLabel:{
    fontSize:14,
    fontWeight:'600',
    color:'#555',
    marginBottom:6,
  },
  input:{
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:12,
    padding:14,
    backgroundColor:'#fff',
    fontSize:16,
    textAlign:'center',
  },
  buttonContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    marginBottom:20,
  },
  button:{
    flex:1,
    marginHorizontal:5,
    paddingVertical:14,
    borderRadius:12,
    justifyContent:'center',
    alignItems:'center',
  },
  buttonText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16,
  },
  musicButton:{
    marginTop:10,
    backgroundColor:'#2196f3',
    paddingVertical:10,
    paddingHorizontal:25,
    borderRadius:20,
  },
  musicText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16,
  }
});

