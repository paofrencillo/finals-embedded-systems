import cv2, time, pandas, requests, base64
from datetime import datetime

# Assigning our static_back to None
static_back = None
  
# List when any moving object appear
motion_list = [ None, None ]
  
# Time of movement
time = []
  
# Initializing DataFrame, one column is start 
# time and other column is end time
df = pandas.DataFrame(columns = ["Start", "End"])
  
# Capturing video
video = cv2.VideoCapture(0)

# number of frames captured with movements
count = 0

def convertToBinaryData(filename):
    # Convert digital data to binary format
    with open(filename, 'rb') as file:
        imageBase64 = base64.b64encode(file.read())
    return imageBase64.decode('utf-8')
  
# Infinite while loop to treat stack of image as video
while True:
    # Reading frame(image) from video
    ret, frame = video.read()
    if frame is None:
        exit()
  
    # Initializing motion = 0(no motion)
    motion = 0
  
    # Converting color image to gray_scale image
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  
    # Converting gray scale image to GaussianBlur 
    # so that change can be find easily
    gray = cv2.GaussianBlur(gray, (21, 21), 0)
  
    # In first iteration we assign the value 
    # of static_back to our first frame
    if static_back is None:
        static_back = gray
        continue
  
    # Difference between static background 
    # and current frame(which is GaussianBlur)
    diff_frame = cv2.absdiff(static_back, gray)
  
    # If change in between static background and
    # current frame is greater than 110 it will show white color(255)
    thresh_frame = cv2.threshold(diff_frame, 100, 255, cv2.THRESH_BINARY)[1]
    thresh_frame = cv2.dilate(thresh_frame, None, iterations=1)
  
    # Finding contour of moving object
    contours, _ = cv2.findContours(thresh_frame.copy(), 
                    cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
  
    for contour in contours:
        if cv2.contourArea(contour) < 10000:
            continue
        motion = 1
  
        (x, y, w, h) = cv2.boundingRect(contour)
        # making red rectangle around the moving object
        # putting text above the rectangle
        box = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.putText(box, 'Movement Detected!', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.5, (0, 0, 255), 1, cv2.LINE_AA)
  
    # Appending status of motion
    motion_list.append(motion)
    motion_list = motion_list[-2:]
    
    # get the current datetime
    time_now = datetime.now()

    # Appending Start time of motion
    if motion_list[-1] == 1 and motion_list[-2] == 0:
        time.append(time_now)
  
    # Appending End time of motion
    elif motion_list[-1] == 0 and motion_list[-2] == 1:
        time.append(time_now)
        
        try:
            # Save the captured frame
            file = f"frame{count}.jpg"
            cv2.imwrite(file, frame)

            # Get the absolute path of saved image (frame)
            # img = os.path.abspath(filepath)
            base64img = convertToBinaryData(file)

            # Increment the count value
            count += 1

            # Make a request
            data = {"captured_on": str(time_now), "captured_image": str(base64img), "file_path": file}
            res = requests.post('http://localhost:5000/post-motion', json=data)

            # Display the json response
            print(res.json())

        except requests.exceptions.ConnectionError as e:
            print("Couldn't connect to the server!")
        
    # Displaying the black and white image in which if
    # intensity difference greater than 110 it will appear white
    # cv2.imshow("Threshold Frame", thresh_frame)
  
    # Displaying color frame with contour of motion of object
    cv2.imshow("Color Frame", frame)
  
    key = cv2.waitKey(1)
    # if q entered whole process will stop
    if key == ord('q'):
        # if something is moving then it append the end time of movement
        if motion == 1:
            time.append(datetime.now())
        break

video.release()
cv2.destroyAllWindows()