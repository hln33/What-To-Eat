import { Component, createSignal, Match, Switch } from "solid-js";
import { DropdownMenuTriggerProps } from "@kobalte/core/dropdown-menu";
import SettingsIcon from "~icons/lucide/settings";

import Button from "@/components/ui/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { IngredientUnit, MeasurementSystem } from "../types";

const IngredientUnitSettings: Component<{
  onWeightUnitChange: (value: IngredientUnit) => void;
}> = (props) => {
  const [measurementSystem, setMeasurementSystem] =
    createSignal<MeasurementSystem>("imperial");

  return (
    <Dropdown>
      <DropdownTrigger
        as={(props: DropdownMenuTriggerProps) => (
          <Button
            size="sm"
            variant="outline"
            {...props}
          >
            <SettingsIcon class="text-slate-300" /> Units
          </Button>
        )}
      />
      <DropdownContent>
        <DropdownGroup>
          <DropdownGroupLabel>Measurement System</DropdownGroupLabel>
          <DropdownRadioGroup
            value={measurementSystem()}
            onChange={(value) =>
              setMeasurementSystem(value as MeasurementSystem)
            }
          >
            <DropdownRadioItem value="imperial">Imperial</DropdownRadioItem>
            <DropdownRadioItem value="metric">Metric</DropdownRadioItem>
          </DropdownRadioGroup>
        </DropdownGroup>

        <DropdownGroup>
          <DropdownGroupLabel>Weight Unit</DropdownGroupLabel>
          <DropdownRadioGroup
            onChange={(value) =>
              props.onWeightUnitChange(value as IngredientUnit)
            }
          >
            <Switch fallback={<div>Error: unknown measurement system</div>}>
              <Match when={measurementSystem() === "imperial"}>
                <DropdownRadioItem value="g">g</DropdownRadioItem>
                <DropdownRadioItem value="kg">Kg</DropdownRadioItem>
              </Match>
              <Match when={measurementSystem() == "metric"}>
                <DropdownRadioItem value="lb">lb</DropdownRadioItem>
                <DropdownRadioItem value="oz">oz</DropdownRadioItem>
              </Match>
            </Switch>
          </DropdownRadioGroup>
        </DropdownGroup>
      </DropdownContent>
    </Dropdown>
  );
};

export default IngredientUnitSettings;
