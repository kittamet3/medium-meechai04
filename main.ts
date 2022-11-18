function Box1 () {
    Forward(Speed, 300)
    Track_Time(Acc_Speed, 600)
    Track_JC(Speed, 100)
    Turn_Right()
    Backward_Balance()
    Track_Time(Acc_Speed, 400)
    Track_JC(Speed, 100)
    Turn_Right()
    Backward_Balance()
    Track_JC(Speed, 100)
    Turn_Right()
    Backward_Balance()
    Track_JC(Speed, 100)
    Turn_Left()
    Backward_Balance()
    Track_JC(Speed, 100)
    Kick()
}
function Turn_Right () {
    Stop()
    iBIT.Spin(ibitSpin.Right, Turn_Speed)
    basic.pause(300)
    Stop()
}
function Forward (Motor_Speed: number, Time: number) {
    Tune_Motor(Motor_Speed)
    iBIT.Motor2(ibitMotor.Forward, Left_Speed, Right_Speed)
    basic.pause(Time)
}
function Tune_Motor (Motor_Speed: number) {
    Error = 0
    Integral = 0
    Pre_Error = 0
    Kp = 15
    Kd = 30
    Ki = 0
    Max_Speed = Motor_Speed
    if (Motor_Speed <= 70) {
        Left_Speed = Motor_Speed - 0
        Right_Speed = Motor_Speed - 0
    } else {
        Left_Speed = Motor_Speed - 0
        Right_Speed = Motor_Speed - 0
    }
}
function Track_JC (Motor_Speed: number, Time: number) {
    Forward(Motor_Speed, 1)
    Cal_Error()
    while (Error < 100) {
        Track_PID()
        Cal_Error()
    }
    Balance()
    Backward(Motor_Speed, Time)
}
input.onButtonPressed(Button.A, function () {
    Box1()
    Box2()
    Box3()
    Stop()
})
function UTurn () {
    Stop()
    iBIT.Spin(ibitSpin.Right, Turn_Speed)
    basic.pause(550)
    Stop()
}
function Convert_6_Analog () {
    Read_6_Analog()
    if (L3 < Ref_L3) {
        L3 = 0
    } else {
        L3 = 1
    }
    if (L2 < Ref_L2) {
        L2 = 0
    } else {
        L2 = 1
    }
    if (L1 < Ref_L1) {
        L1 = 0
    } else {
        L1 = 1
    }
    if (R1 < Ref_R1) {
        R1 = 0
    } else {
        R1 = 1
    }
    if (R2 < Ref_R2) {
        R2 = 0
    } else {
        R2 = 1
    }
    if (R3 < Ref_R3) {
        R3 = 0
    } else {
        R3 = 1
    }
}
function Read_2_Analog () {
    BL = iBIT.ReadADC(ibitReadADC.ADC6)
    BR = iBIT.ReadADC(ibitReadADC.ADC7)
}
function Turn_Left () {
    Stop()
    iBIT.Spin(ibitSpin.Left, Turn_Speed)
    basic.pause(300)
    Stop()
}
function Balance () {
    if (Error == 101) {
        iBIT.Spin(ibitSpin.Left, Slow_Speed)
        while (R1 == 1) {
            Convert_6_Analog()
        }
        basic.pause(10)
    } else if (Error == 102) {
        iBIT.Spin(ibitSpin.Right, Slow_Speed)
        while (L1 == 1) {
            Convert_6_Analog()
        }
        basic.pause(10)
    }
    Stop()
}
function Read_6_Analog () {
    L3 = iBIT.ReadADC(ibitReadADC.ADC0)
    L2 = iBIT.ReadADC(ibitReadADC.ADC1)
    L1 = iBIT.ReadADC(ibitReadADC.ADC2)
    R1 = iBIT.ReadADC(ibitReadADC.ADC3)
    R2 = iBIT.ReadADC(ibitReadADC.ADC4)
    R3 = iBIT.ReadADC(ibitReadADC.ADC5)
}
function Track_Time (Motor_Speed: number, Time: number) {
    Forward(Motor_Speed, 1)
    Timer0 = input.runningTime()
    while (input.runningTime() - Timer0 < Time) {
        Cal_Error()
        Track_PID()
    }
}
function Convert_2_Analog () {
    Read_2_Analog()
    if (BL < Ref_BL) {
        BL = 0
    } else {
        BL = 1
    }
    if (BR < Ref_BR) {
        BR = 0
    } else {
        BR = 1
    }
}
input.onButtonPressed(Button.B, function () {
    Read_6_Analog()
    basic.showNumber(L3)
    basic.pause(5000)
    basic.showNumber(L2)
    basic.pause(5000)
    basic.showNumber(L1)
    basic.pause(5000)
    basic.showNumber(R1)
    basic.pause(5000)
    basic.showNumber(R2)
    basic.pause(5000)
    basic.showNumber(R3)
    basic.pause(5000)
    Read_2_Analog()
    basic.showNumber(BL)
    basic.pause(5000)
    basic.showNumber(BR)
})
function Box3 () {
    Backward(Speed, 400)
}
function Kick () {
    Stop()
    iBIT.Servo(ibitServo.SV1, 80)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV1, 140)
}
function Track_PID () {
    Derivative = Error - Pre_Error
    Output = Kp * Error + (Ki * Integral + Kd * Derivative)
    Left_Output = Left_Speed + Output
    Right_Output = Right_Speed - Output
    if (Left_Output > Max_Speed) {
        Left_Output = Max_Speed
    }
    if (Right_Output > Max_Speed) {
        Right_Output = Max_Speed
    }
    if (Left_Output < -1 * Max_Speed) {
        Left_Output = -1 * Max_Speed
    }
    if (Right_Output < -1 * Max_Speed) {
        Right_Output = -1 * Max_Speed
    }
    if (Left_Output >= 0) {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Forward, Left_Output)
    } else {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Backward, Left_Output)
    }
    if (Right_Output >= 0) {
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Forward, Right_Output)
    } else {
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Backward, Right_Output)
    }
    Pre_Error = Error
    Integral += Error
}
function Cal_Error () {
    Convert_6_Analog()
    if (L1 == 0 && R1 == 0) {
        Error = 100
    } else if (L1 == 0 && R1 == 1) {
        Error = 101
    } else if (L1 == 1 && R1 == 0) {
        Error = 102
    } else if (R2 == 1 && R3 == 0) {
        Error = -1
    } else if (R2 == 0 && R3 == 0) {
        Error = -2
    } else if (R2 == 0 && R3 == 1) {
        Error = -3
    } else if (L3 == 0 && L2 == 1) {
        Error = 1
    } else if (L3 == 0 && L2 == 0) {
        Error = 2
    } else if (L3 == 1 && L2 == 0) {
        Error = 3
    } else {
        Error = 0
    }
}
function Backward_Balance () {
    Backward(Slow_Speed, 1)
    Status = 0
    while (Status == 0) {
        Convert_2_Analog()
        if (BL == 0 && BR == 0) {
            Status = 1
        } else if (BL == 0 && BR == 1) {
            iBIT.MotorStop()
            iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Backward, Slow_Speed)
            while (BR == 1) {
                Convert_2_Analog()
            }
            Status = 2
        } else if (BL == 1 && BR == 0) {
            iBIT.MotorStop()
            iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Backward, Slow_Speed)
            while (BL == 1) {
                Convert_2_Analog()
            }
            Status = 3
        }
    }
    Stop()
}
function Stop () {
    iBIT.MotorStop()
    basic.pause(100)
}
function Box2 () {
    Backward(Speed, 400)
}
function Backward (Motor_Speed: number, Time: number) {
    Tune_Motor(Motor_Speed)
    iBIT.Motor2(ibitMotor.Backward, Left_Speed - 0, Right_Speed - 0)
    basic.pause(Time)
}
let Status = 0
let Right_Output = 0
let Left_Output = 0
let Output = 0
let Derivative = 0
let Timer0 = 0
let BR = 0
let BL = 0
let R3 = 0
let R2 = 0
let R1 = 0
let L1 = 0
let L2 = 0
let L3 = 0
let Max_Speed = 0
let Ki = 0
let Kd = 0
let Kp = 0
let Pre_Error = 0
let Integral = 0
let Error = 0
let Right_Speed = 0
let Left_Speed = 0
let Ref_BR = 0
let Ref_BL = 0
let Ref_R3 = 0
let Ref_R2 = 0
let Ref_R1 = 0
let Ref_L1 = 0
let Ref_L2 = 0
let Ref_L3 = 0
let Turn_Speed = 0
let Slow_Speed = 0
let Acc_Speed = 0
let Speed = 0
Speed = 70
Acc_Speed = 100
Slow_Speed = 50
Turn_Speed = 70
iBIT.setADC_Address(adcAddress.iBIT_V1)
basic.showIcon(IconNames.Chessboard)
Kick()
Ref_L3 = 2500
Ref_L2 = 2500
Ref_L1 = 2500
Ref_R1 = 2500
Ref_R2 = 2500
Ref_R3 = 2500
Ref_BL = 2500
Ref_BR = 2500
