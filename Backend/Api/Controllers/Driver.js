//function for driver to sign up
import ethers from "ethers";
export async function signup(req, res) {
  const { name, email, password } = req.body;
  res.status(200).json({ message: "Driver signed up successfully" });
}

// function for driver to login with email and password through smart contracts

// function to accept ride request from rider

export async function acceptRideRequest(req, res, rides, drives) {
  const { driver_Id } = req.params;
  const { ride_Id, time, distance } = req.body;

  const driverobj = {
    drives_number: 1,
    driver_Id,
    time,
    status: "accepted",
    drive_list: [{ ride_Id, time, status: "accepted" }],
  };

  // Find the ride in the rides array
  const rideIndex = rides.findIndex(
    (ride) => ride.ride_Id === parseInt(ride_Id)
  );

  if (rides[rideIndex].status === "requested") {
    rides[rideIndex].status = "accepted";
    const Drive_Index = drives.findIndex(
      (drive) => drive.driver_Id === parseInt(driver_Id)
    );
    if (Drive_Index === -1) {
      drives.push(driverobj);
      res.status(200).json({ message: "Ride request accepted successfully" });
    } else {
      drives[Drive_Index].drives_number = drives[Drive_Index].drives_number + 1;
      drives[Drive_Index].status = "accepted";
      drives[Drive_Index].time = time;
      drives[Drive_Index].drive_list.push({
        ride_Id,
        time,
        status: "accepted",
      });
      res.status(200).json({ message: "Ride request accepted successfully" });
    }
  } else {
    return res
      .status(400)
      .json({ error: `Ride request with id ${ride_Id} not found` });
  }
}

// function to reject ride request from rider
export async function cancelRideRequest(req, res, rides, drives) {
  const { driver_Id } = req.params;
  const { ride_Id, time } = req.body;

  // Find the ride in the rides array
  const rideIndex = rides.findIndex(
    (ride) => ride.ride_Id === parseInt(ride_Id)
  );

  if (rideIndex !== -1) {
    if (rides[rideIndex].status === "requested") {
      rides[rideIndex].status = "cancelled";

      const Drive_Index = drives.findIndex(
        (drive) => drive.driver_Id === parseInt(driver_Id)
      );
      if (Drive_Index === -1) {
        res
          .status(200)
          .json({ message: "Ride request cancelled successfully" });
      } else {
        drives[Drive_Index].status = "cancelled";
        drives[Drive_Index].time = time;
        drives[Drive_Index].drive_list.push({
          ride_Id,
          time,
          status: "cancelled",
        });
        res
          .status(200)
          .json({ message: "Ride request cancelled successfully" });
      }
    } else {
      return res.status(400).json({
        error: `Ride request with id ${ride_Id} not in requested status`,
      });
    }
  } else {
    return res
      .status(400)
      .json({ error: `Ride request with id ${ride_Id} not found` });
  }
}

// function to check id driver has reached the rider pickup location with checking the distance
export async function pickupReached(req, res, rides, drives) {
  const { driver_Id } = req.params;
  const { ride_Id, time, pickup_Distance } = req.body;
  if (pickup_Distance <= 500) {
    const Drive_Index = drives.findIndex(
      (drive) => drive.driver_Id === parseInt(driver_Id)
    );
    if (Drive_Index === -1) {
      res.status(200).json({ message: "Ride request cancelled successfully" });
    } else {
      drives[Drive_Index].status = "reached";
      drives[Drive_Index].time = time;
      drives[Drive_Index].drive_list.push({
        ride_Id,
        time,
        status: "reached",
      });
      res.status(200).json({ message: "Too far from pickup location" });
    }
  }
}

// function to check if driver has reached the destination with checking the distance

export async function destinationReached(req, res, rides, drives) {
  const { driver_Id } = req.params;
  const { ride_Id, time, pickup_Distance } = req.body;
  if (pickup_Distance <= 500) {
    const Drive_Index = drives.findIndex(
      (drive) => drive.driver_Id === parseInt(driver_Id)
    );
    if (Drive_Index === -1) {
      res.status(200).json({ message: "Ride request cancelled successfully" });
    } else {
      drives[Drive_Index].status = "completed";
      drives[Drive_Index].time = time;
      drives[Drive_Index].drive_list.push({
        ride_Id,
        time,
        status: "completed",
      });
      res.status(200).json({ message: "Too far from Drop location" });
    }
  }
}

// function to emit the driver location to the server constantly
