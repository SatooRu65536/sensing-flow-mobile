import CoreMotion
import SwiftRs
import Tauri
import UIKit
import WebKit
import os

let logger = Logger(subsystem: "dev.satooru.sensing-flow-mobile", category: "SensorKit")

class PingArgs: Decodable {
  let value: String?
}

class StartAccelerometerArgs: Decodable {
  let delayMs: Int?
}

class ExamplePlugin: Plugin {
  private let motionManager = CMMotionManager()
  private var displayLink: CADisplayLink?
  private var updateInterval: TimeInterval = 0.016  // ~60Hz

  @objc public func ping(_ invoke: Invoke) throws {
    let args = try invoke.parseArgs(PingArgs.self)
    invoke.resolve(["value": args.value ?? ""])
  }

  @objc public func startAccelerometer(_ invoke: Invoke) throws {
    // motionManager.isAccelerometerAvailableで利用可能か確認する
    let isAvailable = motionManager.isAccelerometerAvailable
    logger.debug("startAccelerometer called, isAvailable: \(isAvailable)")

    let args = try invoke.parseArgs(StartAccelerometerArgs.self)

    // すでに計測中なら終了
    if motionManager.isAccelerometerActive {
      invoke.resolve()
      return
    }

    // 更新間隔を設定（delayMsに基づいて）
    let delayMs = args.delayMs ?? 0
    let interval: TimeInterval
    switch delayMs {
    case 1...9:
      interval = 0.01  // ~100Hz
    case 10...19:
      interval = 0.016  // ~60Hz
    default:
      interval = 0.1  // ~10Hz
    }
    updateInterval = interval

    motionManager.accelerometerUpdateInterval = interval
    motionManager.startAccelerometerUpdates(to: OperationQueue.main) { [weak self] data, error in
      guard let self = self, let data = data else { return }
      let payload: [String: any JSValue] = [
        "x": data.acceleration.x,
        "y": data.acceleration.y,
        "z": data.acceleration.z,
        "timestamp": data.timestamp,
      ]
      trigger("accelerometer", data: payload)
    }

    invoke.resolve()
  }

  @objc public func stopAccelerometer(_ invoke: Invoke) throws {
    logger.debug("stopAccelerometer called")

    if motionManager.isAccelerometerActive {
      motionManager.stopAccelerometerUpdates()
    }
    invoke.resolve()
  }
}

@_cdecl("init_plugin_sensorkit")
func initPlugin() -> Plugin {
  return ExamplePlugin()
}
