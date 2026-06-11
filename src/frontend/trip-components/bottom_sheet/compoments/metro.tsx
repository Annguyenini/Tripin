import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const LINE = "#D8D8D8";
const ACTIVE = "#111";
const INACTIVE = "#BDBDBD";

export default function MetroTimeline({
  locations = [],
  selectedCity,
  onSelect,
}) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {locations.map((city, index) => {
          const active = selectedCity?.city === city.city;

          return (
            <React.Fragment key={`${city.city}-${index}`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelect?.(city)}
                style={styles.station}
              >
                <View style={[styles.dot, active && styles.activeDot]}>
                  <Text style={[styles.flag, active && styles.activeFlag]}>
                    {getFlag(city.iso_country_code)}
                  </Text>
                </View>

                <Text
                  numberOfLines={1}
                  style={[styles.city, active && styles.activeCity]}
                >
                  {city.city}
                </Text>

                <Text style={styles.count}>{city.medias?.length ?? 0}</Text>
              </TouchableOpacity>

              {index < locations.length - 1 && <View style={styles.line} />}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}

function getFlag(code) {
  if (!code) return "🌍";

  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt()))
    .join("");
}

const styles = StyleSheet.create({
  container: {
    height: 170,
    justifyContent: "center",
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 30,
    minWidth: width,
  },

  station: {
    width: 95,
    alignItems: "center",
  },

  line: {
    width: 70,
    height: 3,
    backgroundColor: LINE,
    marginBottom: 42,
  },

  dot: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: INACTIVE,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 3,
    borderColor: "#FFF",
  },

  activeDot: {
    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: ACTIVE,

    transform: [
      {
        scale: 1.05,
      },
    ],
  },

  flag: {
    fontSize: 18,
  },

  activeFlag: {
    fontSize: 24,
  },

  city: {
    marginTop: 14,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    maxWidth: 90,
    textAlign: "center",
  },

  activeCity: {
    fontSize: 15,
    color: "#111",
    fontWeight: "700",
  },

  count: {
    marginTop: 4,
    color: "#999",
    fontSize: 11,
  },
});
