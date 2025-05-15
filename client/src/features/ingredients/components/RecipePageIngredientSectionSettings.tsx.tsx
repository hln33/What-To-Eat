import {
  Accessor,
  Component,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import { DropdownMenuTriggerProps } from "@kobalte/core/dropdown-menu";
import SettingsIcon from "~icons/lucide/settings";

import Button from "@/components/ui/Button";
import {
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { IngredientUnit, MeasurementSystem } from "../types";

const RecipePageIngredientSectionSettings: Component<{
  selectedUnit: Accessor<IngredientUnit | null>;
  onSelectedUnitChange: (unit: IngredientUnit | null) => void;
}> = (props) => {
  const [convertUnits, setConvertUnits] = createSignal(false);
  const [measurementSystem, setMeasurementSystem] =
    createSignal<MeasurementSystem>("imperial");

  return (
    <Dropdown>
      <DropdownTrigger
        as={(props: DropdownMenuTriggerProps) => (
          <Button
            {...props}
            size="sm"
            variant="outline"
            aria-label="Customize units of measurement"
          >
            <SettingsIcon class="text-slate-300" /> Units
          </Button>
        )}
      />
      <DropdownContent>
        <p class="w-52 text-pretty p-3">
          <span class="block text-lg font-bold">Unit Settings</span>
          <span class="font-light text-slate-100">
            Choose your preferred units of measurement.
          </span>
        </p>
        <DropdownCheckboxItem
          checked={convertUnits()}
          onChange={(value) => {
            setConvertUnits(value);
            if (value === false) {
              props.onSelectedUnitChange(null);
            }
          }}
        >
          Convert units
        </DropdownCheckboxItem>

        <Show when={convertUnits() === true}>
          <DropdownSeparator />
          <div class="space-y-2">
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
                value={props.selectedUnit()!}
                onChange={(value) =>
                  props.onSelectedUnitChange(value as IngredientUnit)
                }
              >
                <Switch fallback={<div>Error: unknown measurement system</div>}>
                  <Match when={measurementSystem() === "metric"}>
                    <DropdownRadioItem value="g">Grams (g)</DropdownRadioItem>
                    <DropdownRadioItem value="kg">
                      Kilograms (kg)
                    </DropdownRadioItem>
                  </Match>
                  <Match when={measurementSystem() === "imperial"}>
                    <DropdownRadioItem value="lb">
                      Pounds (lb)
                    </DropdownRadioItem>
                    <DropdownRadioItem value="oz">
                      Ounces (oz)
                    </DropdownRadioItem>
                  </Match>
                </Switch>
              </DropdownRadioGroup>
            </DropdownGroup>
          </div>
        </Show>
      </DropdownContent>
    </Dropdown>
  );
};

export default RecipePageIngredientSectionSettings;
