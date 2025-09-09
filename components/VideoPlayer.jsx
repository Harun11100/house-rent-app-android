import React, { useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking, Dimensions, ActivityIndicator } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

const VideoPlayer = ({ videoId }) => {
  const [loading, setLoading] = useState(true);
  const videoWidth = width * 0.95;
  const videoHeight = videoWidth * 0.56;


  return (
    <View style={styles.container}>
      {/* YouTube video */}
      <View style={styles.videoWrapper}>
        {loading && (
          <ActivityIndicator size="large" color="#FF0000" style={StyleSheet.absoluteFill} />
        )}
        <YoutubePlayer
          height={videoHeight}
          width={videoWidth}
          play={false}
          videoId={videoId}
          onReady={() => setLoading(false)}
        />
      </View>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  videoWrapper: {
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
 
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  subscribeBtn: {
    backgroundColor: "#FF0000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
