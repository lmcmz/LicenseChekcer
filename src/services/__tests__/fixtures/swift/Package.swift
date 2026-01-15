// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "LicenseChecker",
    platforms: [
        .macOS(.v13),
        .iOS(.v16),
        .tvOS(.v16),
        .watchOS(.v9)
    ],
    products: [
        .library(
            name: "LicenseChecker",
            targets: ["LicenseChecker"]),
        .executable(
            name: "license-checker-cli",
            targets: ["LicenseCheckerCLI"])
    ],
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.1"),
        .package(url: "https://github.com/SwiftyJSON/SwiftyJSON.git", from: "5.0.1"),
        .package(url: "https://github.com/vapor/vapor.git", from: "4.89.0"),
        .package(url: "https://github.com/apple/swift-argument-parser.git", from: "1.3.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.5.3"),
        .package(url: "https://github.com/realm/realm-swift.git", branch: "master"),
        .package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", revision: "84e546727d66f1adc5439debad16270d0fdd04e7")
    ],
    targets: [
        .target(
            name: "LicenseChecker",
            dependencies: [
                "Alamofire",
                "SwiftyJSON",
                .product(name: "Vapor", package: "vapor"),
                .product(name: "Logging", package: "swift-log"),
                "KeychainAccess"
            ]),
        .executableTarget(
            name: "LicenseCheckerCLI",
            dependencies: [
                "LicenseChecker",
                .product(name: "ArgumentParser", package: "swift-argument-parser")
            ]),
        .testTarget(
            name: "LicenseCheckerTests",
            dependencies: ["LicenseChecker"]),
    ]
)
