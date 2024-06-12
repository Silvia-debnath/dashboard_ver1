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
} from "@mui/material";
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

  return (
    <div className="bg-black text-white min-h-screen p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
      </div>
      <div className="bg-black text-white min-h-screen p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <Card className="bg-black p-2 md:p-4 lg:col-span-3 rounded-lg">
            <CardHeader>
              <CardTitle>Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] md:h-[200px] lg:h-[500px]">
              <MapContainer
                center={[position[0], position[1]]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </MapContainer>
            </CardContent>
            <div className="mt-4">
              <Card className="bg-black p-2 md:p-4 rounded-lg">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base text-white">
                    Resolution Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 md:space-x-4 mb-2 text-white">
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
                        className="text-white"
                      />
                      <FormControlLabel
                        value="daily"
                        control={<Radio />}
                        label="Daily"
                        className="text-white"
                      />
                      <FormControlLabel
                        value="monthly"
                        control={<Radio />}
                        label="Monthly"
                        className="text-white"
                      />
                    </RadioGroup>
                  </div>
                  <MuiSlider
                    value={timeRange}
                    onChange={(e, value) => setTimeRange(value as number[])}
                    min={0}
                    max={24}
                    marks={true}
                    step={2}
                    valueLabelDisplay="auto"
                    className="w-full"
                    sx={{
                      color: "blue",
                      "& .MuiSlider-rail": {
                        color: "blue",
                      },
                      "& .MuiSlider-track": {
                        color: "blue",
                      },
                      "& .MuiSlider-thumb": {
                        color: "blue",
                      },
                    }}
                  ></MuiSlider>
                  <div className="flex justify-between items-center mb-4 mt-2">
                    <MuiButton
                      variant="contained"
                      color="primary"
                      onClick={handleApply}
                      className="text-white bg-blue-500 hover:bg-blue-600 text-xs md:text-sm"
                    >
                      APPLY
                    </MuiButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:col-span-2">
            <Card className="bg-black p-2 md:p-4">
              <CardHeader>
                <CardTitle className="text-sm md:text-base text-white">
                  LIFTING SETTINGS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="amount-water"
                    className="text-sm md:text-base text-white"
                  >
                    Amount of Water
                  </Label>
                  <Input
                    id="amount-water"
                    value={liftingSettings.amountOfWater}
                    onChange={(e) =>
                      handleSettingsChange("liftingSettings", {
                        ...liftingSettings,
                        amountOfWater: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  ></Input>

                  <Label
                    htmlFor="lifting-height"
                    className="text-sm md:text-base text-white"
                  >
                    Lifting Height
                  </Label>
                  <Input
                    id="lifting-height"
                    value={liftingSettings.liftingHeight}
                    onChange={(e) =>
                      handleSettingsChange("liftingSettings", {
                        ...liftingSettings,
                        liftingHeight: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  />
                  <Label
                    htmlFor="lifting-time"
                    className="text-sm md:text-base text-white"
                  >
                    Time of Day
                  </Label>
                  <MuiSlider
                    value={[
                      liftingSettings.timeOfDay.start,
                      liftingSettings.timeOfDay.end,
                    ]}
                    onChange={(e, value) =>
                      handleSliderChange("liftingSettings", value as number[])
                    }
                    min={0}
                    max={24}
                    marks={true}
                    step={3}
                    valueLabelDisplay="auto"
                    className="w-full"
                    sx={{
                      color: "blue",
                      "& .MuiSlider-rail": {
                        color: "blue",
                      },
                      "& .MuiSlider-track": {
                        color: "blue",
                      },
                      "& .MuiSlider-thumb": {
                        color: "blue",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black p-2 md:p-4">
              <CardHeader>
                <CardTitle className="text-sm md:text-base text-white">
                  DISTRIBUTION SETTINGS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="distribution-area"
                    className="text-sm md:text-base text-white"
                  >
                    Area of Distribution
                  </Label>
                  <Input
                    id="distribution-area"
                    value={distributionSettings.areaOfDistribution}
                    onChange={(e) =>
                      handleSettingsChange("distributionSettings", {
                        ...distributionSettings,
                        areaOfDistribution: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  />
                  <Label
                    htmlFor="distribution-depth"
                    className="text-sm md:text-base text-white"
                  >
                    Depth of Distribution
                  </Label>
                  <Input
                    id="distribution-depth"
                    value={distributionSettings.depthOfDistribution}
                    onChange={(e) =>
                      handleSettingsChange("distributionSettings", {
                        ...distributionSettings,
                        depthOfDistribution: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  />
                  <Label
                    htmlFor="distribution-time"
                    className="text-sm md:text-base text-white"
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
                      color: "blue",
                      "& .MuiSlider-rail": {
                        color: "blue",
                      },
                      "& .MuiSlider-track": {
                        color: "blue",
                      },
                      "& .MuiSlider-thumb": {
                        color: "blue",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black p-2 md:p-4">
              <CardHeader>
                <CardTitle className="text-sm md:text-base text-white">
                  PRESSURE SETTINGS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="pressure-water"
                    className="text-sm md:text-base text-white"
                  >
                    Amount of Water
                  </Label>
                  <Input
                    id="pressure-water"
                    value={pressureSettings.amountOfWater}
                    onChange={(e) =>
                      handleSettingsChange("pressureSettings", {
                        ...pressureSettings,
                        amountOfWater: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  />
                  <Label
                    htmlFor="pressure-required"
                    className="text-sm md:text-base text-white"
                  >
                    Pressure Required
                  </Label>
                  <Input
                    id="pressure-required"
                    value={pressureSettings.pressureRequired}
                    onChange={(e) =>
                      handleSettingsChange("pressureSettings", {
                        ...pressureSettings,
                        pressureRequired: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  />
                  <Label
                    htmlFor="pressure-time"
                    className="text-sm md:text-base text-white"
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
                      color: "blue",
                      "& .MuiSlider-rail": {
                        color: "blue",
                      },
                      "& .MuiSlider-track": {
                        color: "blue",
                      },
                      "& .MuiSlider-thumb": {
                        color: "blue",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black p-2 md:p-4">
              <CardHeader>
                <CardTitle className="text-sm md:text-base text-white">
                  SOLAR SETTINGS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="solar-area"
                    className="text-sm md:text-base text-white"
                  >
                    Net Area of Active Solar Panels
                  </Label>
                  <Input
                    id="solar-area"
                    value={solarSettings.netAreaOfActiveSolarPanels}
                    onChange={(e) =>
                      handleSettingsChange("solarSettings", {
                        ...solarSettings,
                        netAreaOfActiveSolarPanels: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  />
                  <Label
                    htmlFor="solar-efficiency"
                    className="text-sm md:text-base text-white"
                  >
                    Solar Panel Efficiency
                  </Label>
                  <Input
                    id="solar-efficiency"
                    value={solarSettings.solarPanelEfficiency}
                    onChange={(e) =>
                      handleSettingsChange("solarSettings", {
                        ...solarSettings,
                        solarPanelEfficiency: Number(e.target.value),
                      })
                    }
                    className="text-white bg-black"
                  />
                  <Label
                    htmlFor="solar-time"
                    className="text-sm md:text-base text-white"
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
                      color: "blue",
                      "& .MuiSlider-rail": {
                        color: "blue",
                      },
                      "& .MuiSlider-track": {
                        color: "blue",
                      },
                      "& .MuiSlider-thumb": {
                        color: "blue",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-4"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <Card className="bg-black p-2 md:p-4 rounded-lg border border-white">
          <div className="text-white mb-3">Cloud</div>
          <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
        </Card>
        <Card className="bg-black p-2 md:p-4 rounded-lg border border-white">
          <div className="text-white mb-3">Solar Radiation</div>
          <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
        </Card>
        <Card className="bg-black p-2 md:p-4 rounded-lg border border-white">
          <div className="text-white mb-3">Power Generated</div>
          <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <Card className="bg-black p-2 md:p-4 rounded-lg border border-white">
          <div className="text-white mb-3">Net Demand</div>
          <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
        </Card>
        <Card className="bg-black p-2 md:p-4 rounded-lg border border-white">
          <div className="text-white mb-3">Deficit</div>
          <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
        </Card>
        <Card className="bg-black p-2 md:p-4 rounded-lg border border-white">
          <div className="text-white mb-3">Buying/Selling</div>
          <LineChart className="w-full h-[150px] md:h-[200px] lg:h-[250px]" />
        </Card>
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
              { x: "20", y: 137 },
              { x: "40", y: 61 },
              { x: "60", y: 145 },
              { x: "80", y: 26 },
              { x: "100", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "0", y: 60 },
              { x: "20", y: 48 },
              { x: "40", y: 177 },
              { x: "60", y: 78 },
              { x: "80", y: 96 },
              { x: "100", y: 204 },
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
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#D500F9", "#26A69A"]}
        pointSize={12}
        pointColor={"#ffffff"}
        useMesh={true}
        gridYValues={6}
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
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}
