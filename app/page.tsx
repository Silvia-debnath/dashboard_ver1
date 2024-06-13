"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Button as MuiButton,
  Slider as MuiSlider,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Switch,
} from "@mui/material";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { ResponsiveLine } from "@nivo/line";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function Home() {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [liftingSettings, setLiftingSettings] = useState({
    amountOfWater: 123345,
    liftingHeight: 123345,
    timeOfDay: { start: 5, end: 11 },
  });
  const [distributionSettings, setDistributionSettings] = useState({
    areaOfDistribution: 123345,
    depthOfDistribution: 123345,
    timeOfDay: { start: 5, end: 11 },
  });
  const [pressureSettings, setPressureSettings] = useState({
    amountOfWater: 123345,
    pressureRequired: 123345,
    timeOfDay: { start: 5, end: 11 },
  });
  const [solarSettings, setSolarSettings] = useState({
    netAreaOfActiveSolarPanels: 123345,
    solarPanelEfficiency: 123345,
    timeOfDay: { start: 5, end: 11 },
  });
  const [timeResolution, setTimeResolution] = useState("hourly");
  const [timeRange, setTimeRange] = useState([5, 11]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // State for toggling dark/light mode

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
  };

  interface LiftingSettings {
    amountOfWater: number;
    liftingHeight: number;
    timeOfDay: { start: number; end: number };
  }

  interface DistributionSettings {
    areaOfDistribution: number;
    depthOfDistribution: number;
    timeOfDay: { start: number; end: number };
  }

  interface PressureSettings {
    amountOfWater: number;
    pressureRequired: number;
    timeOfDay: { start: number; end: number };
  }

  interface SolarSettings {
    netAreaOfActiveSolarPanels: number;
    solarPanelEfficiency: number;
    timeOfDay: { start: number; end: number };
  }

  const handleSettingsChange = (setting: string, value: any) => {
    // Update the appropriate state based on the setting
    switch (setting) {
      case "liftingSettings":
        setLiftingSettings(value as LiftingSettings);
        break;
      case "distributionSettings":
        setDistributionSettings(value as DistributionSettings);
        break;
      case "pressureSettings":
        setPressureSettings(value as PressureSettings);
        break;
      case "solarSettings":
        setSolarSettings(value as SolarSettings);
        break;
      default:
        break;
    }
  };

  const handleApply = async () => {
    try {
      // Send the settings to the API
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          liftingSettings,
          distributionSettings,
          pressureSettings,
          solarSettings,
        }),
      });

      const handleApply = () => {
        if (timeResolution === "hourly") {
          console.log("Slider Value:", timeRange);
        } else if (timeResolution === "daily") {
          console.log("Selected Date:", selectedDate);
        }
      };

      if (response.ok) {
        console.log("Settings applied successfully");
      } else {
        console.error("Failed to apply settings");
      }
    } catch (error) {
      console.error("Error applying settings:", error);
    }
  };

  const handleSliderChange = (setting: string, newValue: number[]) => {
    if (Array.isArray(newValue)) {
      const [start, end] = newValue;
      handleSettingsChange(setting, {
        ...getSettingsFromString(setting),
        timeOfDay: { start, end },
      });
    }
  };

  const getSettingsFromString = (setting: string) => {
    switch (setting) {
      case "liftingSettings":
        return liftingSettings;
      case "distributionSettings":
        return distributionSettings;
      case "pressureSettings":
        return pressureSettings;
      case "solarSettings":
        return solarSettings;
      default:
        return {};
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`${isDarkMode ? "bg-black text-white" : "bg-white text-black"
        } min-h-screen p-8 md:p-6 lg:p-8`}
    >
      <div className="inline-flex flex-col justify-center items-center gap-14 relative ml-3">
        <div className="inline-flex flex-row justify-between items-center w-full">
          <div className="text-3xl ml-2 mt-2">Dashboard</div>
          <Switch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            color="primary"
          />
        </div>
        <div className="inline-flex flex-col  gap-[50px] relative ml-4 ">
          <div className="inline-flex justify-center items-center gap-[30px] relative">
            <div className="flex flex-col w-[669px] h-[642px] items-start gap-[11px] relative">
              <div className="relative w-[669px] h-[448px] bg-black rounded-[20px] border border-solid border-[#b2b2b2]">
                <MapContainer
                  center={[position[0], position[1]]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{
                    padding: "10px",
                    height: "100%",
                    borderRadius: "20px",
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </MapContainer>
              </div>
              <div className="relative w-[669px] h-[183px] bg-black rounded-[15px] border border-solid border-[#bfbfbf]">
                {" "}
                <Card
                  className={`${isDarkMode ? "bg-black" : "bg-white"
                    } rounded-lg`}
                >
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center justify-center text-center text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                        }`}
                    >
                      Resolution Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      row
                      aria-label="time-resolution"
                      name="time-resolution"
                      value={timeResolution}
                      onChange={(e) => setTimeResolution(e.target.value)}
                    >
                      <FormControlLabel
                        value="hourly"
                        control={<Radio />}
                        label="Hourly"
                        className={`${isDarkMode ? "text-white" : "text-black"}`}
                      />
                      <FormControlLabel
                        value="daily"
                        control={<Radio />}
                        label="Daily"
                        className={`${isDarkMode ? "text-white" : "text-black"}`}
                      />
                      <FormControlLabel
                        value="monthly"
                        control={<Radio />}
                        label="Monthly"
                        className={`${isDarkMode ? "text-white" : "text-black"}`}
                      />
                    </RadioGroup>
                    <div className="flex mb-4">
                      {timeResolution === "hourly" && (
                        <MuiSlider
                          value={timeRange}
                          onChange={(e, value) =>
                            setTimeRange(value as number[])
                          }
                          min={0}
                          max={23}
                          marks={true}
                          step={2}
                          valueLabelDisplay="auto"
                          className="w-full"
                          sx={{
                            color: "#2196F3",
                            "& .MuiSlider-rail": {
                              color: "#2196F3",
                            },
                            "& .MuiSlider-track": {
                              color: "#2196F3",
                            },
                            "& .MuiSlider-thumb": {
                              color: "#2196F3",
                            },
                          }}
                        ></MuiSlider>
                      )}
                      {timeResolution === "daily" && (
                        <div
                          className={`flex justify-center items-center ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={[
                                "DateRangePicker",
                                "DateRangePicker",
                                "DateRangePicker",
                              ]}
                            >
                              <DemoItem
                                label=""
                                component="DateRangePicker"
                              >
                                <DateRangePicker calendars={1} />
                              </DemoItem>
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      )}
                      {timeResolution === "monthly" && (
                        <div
                          className={`flex justify-center items-center ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateRangePicker"]}>
                              <DateRangePicker
                                localeText={{
                                  start: "--/--/----",
                                  end: "--/--/----",
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <MuiButton
                          variant="contained"
                          color="primary"
                          onClick={handleApply}
                          className={`${isDarkMode
                            ? "text-white bg-blue-500 hover:bg-blue-600"
                            : "text-black bg-blue-500 hover:bg-blue-600"
                            } text-xs md:text-sm ml-4`}
                        >
                          APPLY
                        </MuiButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex flex-wrap w-[677px] items-start gap-[30px_30px] relative">
              <div
                className={`relative w-[321px] h-[311px] ${isDarkMode ? "bg-black" : "bg-white"
                  } rounded-[20px] ${isDarkMode
                    ? "border border-solid border-[#ffffffb2]"
                    : "border border-solid border-[#0000001a]"
                  }`}
              >
                <Card
                  className={`${isDarkMode ? "bg-black" : "bg-white"}`}
                >
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center justify-center text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                        }`}
                    >
                      LIFTING SETTINGS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label
                        htmlFor="pressure-water"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Amount of Water
                      </Label>
                      <div className="flex">
                        <Input
                          id="pressure-water"
                          value={pressureSettings.amountOfWater}
                          onChange={(e) =>
                            handleSettingsChange("pressureSettings", {
                              ...pressureSettings,
                              amountOfWater: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode
                            ? "text-white bg-black"
                            : "text-black bg-white"
                            } w-4/5`}
                        />{" "}
                        <div
                          className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          ltrs.
                        </div>
                      </div>
                      <Label
                        htmlFor="pressure-required"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Lifting Height
                      </Label>
                      <div className="flex">
                        <Input
                          id="pressure-required"
                          value={pressureSettings.pressureRequired}
                          onChange={(e) =>
                            handleSettingsChange("pressureSettings", {
                              ...pressureSettings,
                              pressureRequired: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode
                            ? "text-white bg-black"
                            : "text-black bg-white"
                            } w-4/5`}
                        />{" "}
                        <div
                          className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          ft.
                        </div>
                      </div>
                      <Label
                        htmlFor="pressure-time"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Time of Day
                      </Label>
                      <MuiSlider
                        value={[
                          pressureSettings.timeOfDay.start,
                          pressureSettings.timeOfDay.end,
                        ]}
                        onChange={(e, value) =>
                          handleSliderChange("pressureSettings", value as number[])
                        }
                        min={0}
                        max={24}
                        marks={true}
                        step={3}
                        valueLabelDisplay="auto"
                        className="w-full"
                        sx={{
                          color: "#2196F3",
                          "& .MuiSlider-rail": {
                            color: "#2196F3",
                          },
                          "& .MuiSlider-track": {
                            color: "#2196F3",
                          },
                          "& .MuiSlider-thumb": {
                            color: "#2196F3",
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div
                className={`relative w-[321px] h-[311px] ${isDarkMode ? "bg-black" : "bg-white"
                  } rounded-[20px] ${isDarkMode
                    ? "border border-solid border-[#ffffffb2]"
                    : "border border-solid border-[#0000001a]"
                  }`}
              >
                <Card className={`${isDarkMode ? "bg-black" : "bg-white"}`}>
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center justify-center text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                        }`}
                    >
                      DISTRIBUTION SETTINGS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label
                        htmlFor="solar-area"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Area of Distribution
                      </Label>
                      <div className="flex">
                        <Input
                          id="solar-area"
                          value={solarSettings.netAreaOfActiveSolarPanels}
                          onChange={(e) =>
                            handleSettingsChange("solarSettings", {
                              ...solarSettings,
                              netAreaOfActiveSolarPanels: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode ? "text-white bg-black" : "text-black bg-white"
                            } w-4/5`}
                        />
                        <div
                          className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          km
                        </div>
                      </div>
                      <Label
                        htmlFor="solar-efficiency"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Depth of Distribution
                      </Label>
                      <div className="flex">
                        <Input
                          id="solar-efficiency"
                          value={solarSettings.solarPanelEfficiency}
                          onChange={(e) =>
                            handleSettingsChange("solarSettings", {
                              ...solarSettings,
                              solarPanelEfficiency: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode ? "text-white bg-black" : "text-black bg-white"
                            } w-4/5`}
                        />
                        <div
                          className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          ft.
                        </div>
                      </div>
                      <Label
                        htmlFor="solar-time"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Time of Day
                      </Label>
                      <MuiSlider
                        value={[
                          solarSettings.timeOfDay.start,
                          solarSettings.timeOfDay.end,
                        ]}
                        onChange={(e, value) =>
                          handleSliderChange("solarSettings", value as number[])
                        }
                        min={0}
                        max={24}
                        marks={true}
                        step={3}
                        valueLabelDisplay="auto"
                        className="w-full"
                        sx={{
                          color: "#2196F3",
                          "& .MuiSlider-rail": {
                            color: "#2196F3",
                          },
                          "& .MuiSlider-track": {
                            color: "#2196F3",
                          },
                          "& .MuiSlider-thumb": {
                            color: "#2196F3",
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div
                className={`relative w-[321px] h-[311px] ${isDarkMode ? "bg-black" : "bg-white"
                  } rounded-[20px] ${isDarkMode
                    ? "border border-solid border-[#ffffffb2]"
                    : "border border-solid border-[#0000001a]"
                  }`}
              >
                <Card className={`${isDarkMode ? "bg-black" : "bg-white"}`}>
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center justify-center text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                        }`}
                    >
                      PRESSURIZATION SETTINGS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label
                        htmlFor="distribution-area"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Amount of water
                      </Label>
                      <div className="flex">
                        <Input
                          id="distribution-area"
                          value={distributionSettings.areaOfDistribution}
                          onChange={(e) =>
                            handleSettingsChange("distributionSettings", {
                              ...distributionSettings,
                              areaOfDistribution: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode ? "text-white bg-black" : "text-black bg-white"
                            } w-4/5`}
                        />
                        <div
                          className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          ltrs.
                        </div>
                      </div>
                      <Label
                        htmlFor="distribution-depth"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Pressurization required
                      </Label>
                      <div className="flex">
                        <Input
                          id="distribution-depth"
                          value={distributionSettings.depthOfDistribution}
                          onChange={(e) =>
                            handleSettingsChange("distributionSettings", {
                              ...distributionSettings,
                              depthOfDistribution: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode ? "text-white bg-black" : "text-black bg-white"
                            } w-4/5`}
                        />
                        <div
                          className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                        >
                          ft.
                        </div>
                      </div>
                      <Label
                        htmlFor="distribution-time"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Time of Day
                      </Label>
                      <MuiSlider
                        value={[
                          distributionSettings.timeOfDay.start,
                          distributionSettings.timeOfDay.end,
                        ]}
                        onChange={(e, value) =>
                          handleSliderChange(
                            "distributionSettings",
                            value as number[]
                          )
                        }
                        min={0}
                        max={24}
                        marks={true}
                        step={3}
                        valueLabelDisplay="auto"
                        className="w-full"
                        sx={{
                          color: "#2196F3",
                          "& .MuiSlider-rail": {
                            color: "#2196F3",
                          },
                          "& .MuiSlider-track": {
                            color: "#2196F3",
                          },
                          "& .MuiSlider-thumb": {
                            color: "#2196F3",
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="relative w-[321px] h-[311px] bg-black rounded-[20px] border border-solid border-[#ffffffb2]">
                <Card className={`${isDarkMode ? "bg-black" : "bg-white"}`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center justify-center text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                      }`}>
                      SOLAR PANEL SETTINGS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Label
                        htmlFor="amount-water"
                        className={`text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                          }`}
                      >
                        Net Area of Active Solar Panels
                      </Label>
                      <div className="flex">
                        <Input
                          id="amount-water"
                          value={liftingSettings.amountOfWater}
                          onChange={(e) =>
                            handleSettingsChange("liftingSettings", {
                              ...liftingSettings,
                              amountOfWater: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode ? "text-white bg-black" : "text-black bg-white"
                            } w-4/5`}
                        ></Input><div className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                          }`}>m³</div>
                      </div>

                      <Label
                        htmlFor="lifting-height"
                        className={`mt-2 text-sm md:text-base ${isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Solar Panel Efficiency
                      </Label>
                      <div className="flex">
                        <Input
                          id="lifting-height"
                          value={liftingSettings.liftingHeight}
                          onChange={(e) =>
                            handleSettingsChange("liftingSettings", {
                              ...liftingSettings,
                              liftingHeight: Number(e.target.value),
                            })
                          }
                          className={`${isDarkMode ? "text-white bg-black" : "text-black bg-white"
                          } w-4/5`}
                        /><div className={`ml-5 mt-2 ${isDarkMode ? "text-white" : "text-black"
                          }`}>%</div>
                      </div>
                      <div className="mt-80"></div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="inline-flex flex-col items-start gap-[19px] relative flex-[0_0_auto]">
            <div className="inline-flex items-start gap-[18px] relative flex-[0_0_auto]">
              <div className="relative w-[450px] h-[299px] bg-black rounded-[13.94px] ">
                <Card className="p-2 bg-black rounded-lg border border-white">
                  <div className="text-white mb-3">Soil Moisture</div>
                  <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
                </Card>
              </div>
              <div className="relative w-[450px] h-[299px] bg-black rounded-[13.94px] ">
                <Card className="p-2 bg-black rounded-lg border border-white">
                  <div className="text-white mb-3">Evapotranspiration</div>
                  <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
                </Card>
              </div>
              <div className="relative w-[450px] h-[299px] bg-black rounded-[13.94px] ">
                <Card className="p-2 bg-black rounded-lg border border-white">
                  <div className="text-white mb-3">Water Demand</div>
                  <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
                </Card>
              </div>
            </div>
            <div className="inline-flex items-start gap-[18px] relative flex-[0_0_auto]">
              <div className="relative w-[450px] h-[299px] bg-black rounded-[13.94px] ">
                <Card className="p-2 bg-black rounded-lg border border-white">
                  <div className="text-white mb-3">Power Demand</div>
                  <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
                </Card>
              </div>
              <div className="relative w-[450px] h-[299px] bg-black rounded-[13.94px] ">
                <Card className="p-2 bg-black rounded-lg border border-white">
                  <div className="text-white mb-3">Surplus Power</div>
                  <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
                </Card>
              </div>
              <div className="relative w-[450px] h-[299px] bg-black rounded-[13.94px] ">
                <Card className="p-2 bg-black rounded-lg border border-white">
                  <div className="text-white mb-3">Irrigation Schedule</div>
                  <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LineChart({ className }: { className: string }) {
  return (
    <div className={className}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "0", y: 43 },
              { x: "20", y: 13 },
              { x: "40", y: 61 },
              { x: "60", y: 45 },
              { x: "80", y: 26 },
              { x: "100", y: 100 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "0", y: 60 },
              { x: "20", y: 48 },
              { x: "40", y: 17 },
              { x: "60", y: 78 },
              { x: "80", y: 66 },
              { x: "100", y: 100 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 5,
          tickValues: 6,
          tickPadding: 16,
        }}
        colors={["#D500F9", "#26A69A"]}
        pointSize={12}
        pointColor={"#ffffff"}
        useMesh={true}
        gridYValues={1}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#ffffff", // Set tick text color to white
              },
            },
          },
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#FFFFFF",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}
