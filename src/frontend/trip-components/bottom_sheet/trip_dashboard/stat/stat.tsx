// ─── External Libraries ───────────────────────────────────────────────────────
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef, useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Modal,
  Image,
} from "react-native";

// ─── Internal Services & Observers ───────────────────────────────────────────
import CurrentTripDataService from "../../../../../backend/storage/hot_data/current_trip";
import TripDisplayObserver from "../../../observers/trip_display_observer";
import TripActionsHandler from "../../../../../app-core/flow/handlers/trip_actions/trip_action_handler";
import UserDataService from "../../../../../backend/storage/async_storage/user";

// ─── UI / Overlay ─────────────────────────────────────────────────────────────
import { UseOverlay } from "../../../../overlay/overlay_main";
import { BottomSheetSyle } from "../../../../../styles/bottom_sheet.styles";
import { colors } from "../../../../../styles/function/trip_style";
import { TripStatCards } from "../../compoments/trip_stat";

import GalleryManager from "./memories_manage";
import TripCustomCard from "../../trips_card/trip_custom_card";

import { Trip_Data } from "../../../../../types/trip_data.types";
import MemoryManager from "./memories_manage";
import CurrentDisplayTripObserver from "../../../observers/current_contents/current_display_contents_observer";
import MapTransform from "../../../main_map/map_transform";

// ─── Assets ───────────────────────────────────────────────────────────────────
const default_image = require("../../../../../../assets/icon.png");

// Privacy badge colors — same rose/sky/sage tokens as the privacy toggle in
// NewTripFiller and TripCustomCard, so a trip's privacy state looks the same
// everywhere it shows up.
const PRIVACY_STYLE = {
  private: { bg: colors.rose, border: colors.roseDark, text: colors.roseDark },
  friends: { bg: colors.sky, border: colors.skyDark, text: colors.skyDark },
  public: { bg: colors.sage, border: colors.sageDark, text: colors.sageDark },
};

// ─────────────────────────────────────────────────────────────────────────────

const TripStat = ({ TripData }) => {

  const bottomSheetRef = useRef(null);

  const [dataKey, setDataKey] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState("Current");
  const [secondTripDisplay, setSecondTripDisplay] = useState(null);

  const [displayTrip, setDisplayTrip] = useState(
    CurrentTripDataService.getCurrentTripStatus(),
  );

  const loadingRef = useRef(null);

  const { showLoading, hideLoading } = UseOverlay();


  // ── Ownership ──────────────────────────────────────────────────────────────

  const isOwner =
    TripData?.user_id === UserDataService.getUserId();

  // ── Privacy badge lookup (style only — text/emoji logic is unchanged) ─────

  const privacyKey =
    TripData.privacy === "private"
      ? "private"
      : TripData.privacy === "friends"
      ? "friends"
      : "public";

  const privacyStyle = PRIVACY_STYLE[privacyKey];



  // ── Fly To ─────────────────────────────────────────────────────────────────

  const FlytoFirstStep = () => {

    const medias =
      CurrentDisplayTripObserver.getAssetArray(
        TripData.trip_id
      );

    if (!medias || medias.length === 0) return;

    MapTransform.flyTo(
      [
        medias[0]?.longitude,
        medias[0]?.latitude
      ],
      10
    );
  };



  const EndLoadingSteps = [
    "Getting your trips...",
    "Look like There are NOTHING",
    "Unpacking the memories...",
    "Dusting off the map...",
    "Almost there...",
  ];



  const TripLoading = () => {

    if (loadingRef.current) return;

    loadingRef.current =
      showLoading(
        HideTripLoading(),
        EndLoadingSteps
      );

  };


  const HideTripLoading = () => {

    if (!loadingRef.current) return;

    hideLoading();
    loadingRef.current = null;

  };



  // ── Handlers ───────────────────────────────────────────────────────────────

  const goBack = () => {
    TripDisplayObserver.deleteTripSelected();
  };


  const end_trip = async () => {

    TripLoading();

    await TripActionsHandler.endTripHandler();

    hideLoading();

    await goBack();

  };



  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {

    if (
      TripData?.trip_id ===
      CurrentTripDataService.getCurrentTripId()
    ) {

      setSecondTripDisplay(false);

      const formatted =
        TripData.created_time
          ? new Date(
              Math.floor(
                TripData.created_time
              )
            ).toLocaleString()
          : "—";

      setStatus(
        `${formatted} -> Current`
      );

    } else {

      const formatted_created =
        TripData.created_time
          ? new Date(
              Math.floor(
                TripData.created_time
              )
            ).toLocaleString()
          : "—";


      const formatted_ended =
        TripData.ended_time
          ? new Date(
              Math.floor(
                TripData.ended_time
              )
            ).toLocaleString()
          : "—";


      setStatus(
        `${formatted_created} - ${formatted_ended}`
      );


      setSecondTripDisplay(true);

    }


    setDataKey(
      (k) => k + 1
    );


  }, []);



  // ── Render ────────────────────────────────────────────────────────────────

  return (

    <View style={{ flex: 1 }}>


      <View style={BottomSheetSyle.titleRow}>


        <Image
          source={
            TripData.image
              ? { uri: TripData.image }
              : default_image
          }
          style={BottomSheetSyle.image}
        />



        <View style={BottomSheetSyle.titleBlock}>


          <View
            style={[
              BottomSheetSyle.tripNameRow,
              {
                alignItems: "center",
              }
            ]}
          >

            <Text style={BottomSheetSyle.tripName}>
              {TripData.trip_name}
            </Text>



            <View
              style={{
                flexDirection:"row",
                alignItems:"center",
                gap:8,
              }}
            >

              {/* Privacy Badge */}

              <View
                style={[
                  BottomSheetSyle.privacyBadge,
                  {
                    backgroundColor: privacyStyle.bg,
                    borderColor: privacyStyle.border,
                  },
                ]}
              >

                <Text
                  style={[
                    BottomSheetSyle.privacyBadgeText,
                    { color: privacyStyle.text },
                  ]}
                >

                  {
                    TripData.privacy === "private"
                    ? "🔒 Private"
                    : TripData.privacy === "friend"
                    ? "👥 Friends"
                    : "🌎 Public"
                  }

                </Text>

              </View>



              {/* Owner Only Menu */}

              {isOwner && (

                <TouchableOpacity
                  style={BottomSheetSyle.moreBtn}
                  onPress={() => setShowEdit(true)}
                >

                  <Text style={BottomSheetSyle.moreBtnText}>
                    •••
                  </Text>

                </TouchableOpacity>

              )}


            </View>


          </View>



          <View style={BottomSheetSyle.statusRow}>

            <View style={BottomSheetSyle.statusDot}/>

            <Text style={BottomSheetSyle.statusText}>
              {status}
            </Text>

          </View>



          {/* Fly To Button */}

          <TouchableOpacity
            onPress={FlytoFirstStep}
            activeOpacity={0.8}
            style={BottomSheetSyle.flyToBtn}
          >

            <Text style={BottomSheetSyle.flyToBtnText}>
              ✈️ Fly to
            </Text>

          </TouchableOpacity>


        </View>




        <View
          style={[
            BottomSheetSyle.endTripCover,
            secondTripDisplay && BottomSheetSyle.endTripCoverGoBack,
          ]}
        >

          {
            secondTripDisplay ? (

              <TouchableOpacity
                onPress={() => {
                  setSecondTripDisplay(null);
                  goBack();
                }}
              >

                <Text style={BottomSheetSyle.upBtnText}>
                  ← GoBack
                </Text>

              </TouchableOpacity>


            ) : (

              <TouchableOpacity
                onPress={end_trip}
              >

                <Text style={BottomSheetSyle.upBtnText}>
                  End trip
                </Text>

              </TouchableOpacity>

            )
          }


        </View>


      </View>



      <TripStatCards />



      <View style={BottomSheetSyle.dividerRow}>

        <View style={BottomSheetSyle.dividerLine}/>

        <Text style={BottomSheetSyle.dividerLabel}>
          the album
        </Text>

        <View style={BottomSheetSyle.dividerLine}/>

      </View>




      {showEdit && (

        <TripCustomCard
          trip={TripData}
          onClose={() => setShowEdit(false)}
        />

      )}




      <MemoryManager
        trip_id={TripData.trip_id}
      />


    </View>

  );

};


export default TripStat;
