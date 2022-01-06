#pragma once
#include "IEffectFactory.h"
#include "TriggerObserverDispatcher.h"
class VisorEffectAction :
    public IEffectFactory
{
public:
    VisorEffectAction(int layer, double speed, RGBColor color);

    // Inherited via IEffectFactory
    virtual void add_new_instance(EffectManager& effect_manager, TriggerObserverDispatcher& trigger_observer_dispatcher) override;
private:
    double _speed;
    RGBColor _color;
    int _layer;
};

