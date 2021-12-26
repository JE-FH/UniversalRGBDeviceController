#pragma once
#include <memory>
#import "libid:F1AA5209-5217-4B82-BA7E-A68198999AFA"
#include "ASUSAuraKeyboardDevice.h"
class ASUSAuraDeviceFactory
{
public:
	ASUSAuraDeviceFactory();
	ASUSAuraDeviceFactory(ASUSAuraDeviceFactory&) = delete;
	~ASUSAuraDeviceFactory();

	std::unique_ptr<ASUSAuraKeyboardDevice> create_keyboard_device();
private:
	AuraServiceLib::IAuraSdk2Ptr _sdk;
};

