// Core
import React, { useState } from 'react';
// UI
import { Button, Card, Field, Radio, RadioGroup, Slider, Text } from '@fluentui/react-components';
// Types
import { FloorLayout, type RoomEstimate, type RoomParams } from '@refloor/core';

interface RoomControlsProps {
  params: RoomParams;
  estimate: RoomEstimate | null;
  onChange: (params: RoomParams) => void;
  onReset: () => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({
  params,
  estimate,
  onChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const update = (patch: Partial<RoomParams>) => {
    onChange({
      ...params,
      ...patch,
    });
  };

  return (
    <>
      <Button
        className="room-controls-toggle"
        appearance="primary"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? 'Скрыть' : 'Параметры'}
      </Button>

      <Card className={`room-controls ${isOpen ? 'room-controls_open' : ''}`}>
        <div className="room-controls__content">
          <section className="room-controls__section">
            <Text className="room-controls__section-title" weight="semibold">
              Размеры комнаты
            </Text>

            <Field label={`Длина: ${params.length.toFixed(1)} м`}>
              <Slider
                min={2}
                max={10}
                step={0.1}
                value={params.length}
                onChange={(_, data) => update({ length: data.value })}
              />
            </Field>

            <Field label={`Ширина: ${params.width.toFixed(1)} м`}>
              <Slider
                min={2}
                max={8}
                step={0.1}
                value={params.width}
                onChange={(_, data) => update({ width: data.value })}
              />
            </Field>

            <Field label={`Высота: ${(params.height ?? 2.7).toFixed(1)} м`}>
              <Slider
                min={2.2}
                max={4}
                step={0.1}
                value={params.height ?? 2.7}
                onChange={(_, data) => update({ height: data.value })}
              />
            </Field>
          </section>

          <section className="room-controls__section">
            <Text className="room-controls__section-title" weight="semibold">
              Пол
            </Text>

            <Field label="Раскладка">
              <RadioGroup
                layout="horizontal"
                value={params.floorLayout ?? FloorLayout.Straight}
                onChange={(_, data) => update({ floorLayout: data.value as FloorLayout })}
              >
                <Radio value={FloorLayout.Straight} label="Прямая" />
                <Radio value={FloorLayout.Herringbone} label="Ёлочка" />
              </RadioGroup>
            </Field>

            <Field label={`Шов между досками: ${Math.round((params.plankGap ?? 0.01) * 1000)} мм`}>
              <Slider
                min={0}
                max={0.03}
                step={0.001}
                value={params.plankGap ?? 0.01}
                onChange={(_, data) => update({ plankGap: data.value })}
              />
            </Field>

            <Field label={`Тепловой зазор: ${Math.round((params.floorWallGap ?? 0.03) * 100)} см`}>
              <Slider
                min={0}
                max={0.06}
                step={0.005}
                value={params.floorWallGap ?? 0.03}
                onChange={(_, data) => update({ floorWallGap: data.value })}
              />
            </Field>
          </section>

          <section className="room-controls__section">
            <Text className="room-controls__section-title" weight="semibold">
              Плинтус
            </Text>

            <Field label={`Высота: ${Math.round((params.baseboardHeight ?? 0.08) * 100)} см`}>
              <Slider
                min={0.04}
                max={0.16}
                step={0.005}
                value={params.baseboardHeight ?? 0.08}
                onChange={(_, data) => update({ baseboardHeight: data.value })}
              />
            </Field>
          </section>

          <section className="room-controls__section">
            <Text className="room-controls__section-title" weight="semibold">
              Цвета
            </Text>

            <div className="room-controls__colors">
              <label className="room-controls__color">
                <span>Стены</span>
                <input
                  type="color"
                  value={params.wallColor ?? '#8c91d5'}
                  onChange={(event) => update({ wallColor: event.target.value })}
                />
              </label>

              <label className="room-controls__color">
                <span>Пол</span>
                <input
                  type="color"
                  value={params.plankColor ?? '#b47a45'}
                  onChange={(event) => update({ plankColor: event.target.value })}
                />
              </label>

              <label className="room-controls__color">
                <span>Плинтус</span>
                <input
                  type="color"
                  value={params.baseboardColor ?? '#ffffff'}
                  onChange={(event) => update({ baseboardColor: event.target.value })}
                />
              </label>
            </div>
          </section>

          <section className="room-controls__estimate">
            <Text weight="semibold">Расчёты</Text>

            <div className="room-controls__estimate-grid">
              <div>
                <span>Доски</span>
                <b>{estimate?.planksCount ?? '—'} шт.</b>
              </div>

              <div>
                <span>Плинтус</span>
                <b>{estimate ? `${estimate.baseboardLength.toFixed(2)} м` : '—'}</b>
              </div>
            </div>
          </section>

          <Button appearance="secondary" style={{ height: 30 }} onClick={onReset}>
            Сбросить параметры
          </Button>
        </div>
      </Card>
    </>
  );
};
