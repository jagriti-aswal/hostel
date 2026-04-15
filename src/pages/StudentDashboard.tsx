return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-gray-500">
          Mark your attendance and manage leave
        </p>
      </div>

      <Button variant="destructive" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      
      {/* ATTENDANCE CARD */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Face Attendance
          </CardTitle>
          <CardDescription>
            Capture your photo to mark attendance
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* STATUS */}
          {isOnLeave && (
            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
              You are currently on leave
            </div>
          )}

          {attendanceMarked && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Attendance marked successfully
            </div>
          )}

          {/* CAMERA */}
          {!isOnLeave && !attendanceMarked && (
            <>
              <div className="rounded-lg overflow-hidden border bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-64 object-cover"
                />
              </div>

              <canvas ref={canvasRef} className="hidden" />

              {/* BUTTONS */}
              <div className="flex gap-2 flex-wrap">
                {!isCameraOpen && (
                  <Button onClick={startCamera}>
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                )}

                {isCameraOpen && (
                  <Button onClick={capturePhoto}>
                    Capture
                  </Button>
                )}

                {capturedImage && (
                  <Button
                    onClick={verifyFace}
                    disabled={isVerifying}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Mark"}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* LEAVE CARD */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Apply Leave
          </CardTitle>
          <CardDescription>
            Submit leave request for multiple days
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={leaveFrom}
              onChange={(e) => setLeaveFrom(e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="date"
              value={leaveTo}
              onChange={(e) => setLeaveTo(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>

          <textarea
            placeholder="Reason for leave..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <Button
            onClick={applyLeave}
            disabled={isOnLeave}
            className="w-full"
          >
            {isOnLeave ? "Already on Leave" : "Apply Leave"}
          </Button>

        </CardContent>
      </Card>
    </div>
  </div>
);