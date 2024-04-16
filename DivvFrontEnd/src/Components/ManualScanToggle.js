import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const ManualScanToggle = ({ activeSegment, setActiveSegment }) => {
  return (
    <View style={styles.segmentedControlContainer}>
      <Pressable
        style={[
          styles.segment,
          activeSegment === "scan" && styles.activeSegment,
        ]}
        onPress={() => setActiveSegment("scan")}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === "scan" && styles.activeSegmentText,
          ]}
        >
          Scan Receipt
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.segment,
          activeSegment === "manual" && styles.activeSegment,
        ]}
        onPress={() => setActiveSegment("manual")}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === "manual" && styles.activeSegmentText,
          ]}
        >
          Manual Entry
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedControlContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#011627", // Background color for the entire segmented control
  },
  segment: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#011627", // Match the background color to make it invisible initially
    alignItems: "center",
    justifyContent: "center",
  },
  activeSegment: {
    borderBottomColor: "#fff", // Color for the underline
  },
  segmentText: {
    color: "#fff", // Color for the text
    fontSize: 18,
  },
  activeSegmentText: {
    fontWeight: "bold",
  },
});

export default ManualScanToggle;
