# Juspay MIT Scratch Clone (Assignment 2)

**Live Project Dashboard:** https://juspay-mit-scratch-assignment.vercel.app/

**Project Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1NE5P9Co547mMWcRaBPlYUX_YuWaqRzia/view?usp=sharing)


## Project Description

This project is an MIT Scratch clone developed as part of the Juspay second-round assignment. It allows users to create simple animations and interactions by adding sprites (Goku and Freeza) and programming them with motion and looks blocks. A special "Hero Feature" allows for script swapping between sprites upon collision.

## Getting Started (Local Development)

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
    *(Replace `<your-repository-url>` with the actual URL of your Git repository if you have one.)*

2.  **Navigate to the project directory:**
    ```bash
    cd MIT_Scratch_juspay
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```
    This will run the app in development mode.

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to view it.

## How to Use the Application

### 1. Adding Sprites
*   Locate the **"+" (Add)** button on the top bar.
*   Clicking it will reveal available sprites: **Freeza** and **Goku**.
*   Click on a sprite's image to add it to the canvas.
*   You can add a maximum of **two sprites**. Adding two sprites is necessary to experience the "Hero Feature" (detailed below).

### 2. Selecting a Sprite for Scripting
*   Once sprites are added, they appear in the **Sprite Bar** (below the header, above the canvas).
*   Click on a sprite in this bar to select it. The selected sprite will be highlighted.
*   The **Script Area** on the right side of the screen will now display the scripts for the selected sprite. If no sprite is selected, or if the selected sprite has no scripts, this area will be empty or show a placeholder.

### 3. Building Scripts
*   Ensure the sprite you want to program is selected (see step 2).
*   On the left sidebar, you'll find block categories like **"Motion"** and **"Looks"**. Click a category to see its blocks.
*   To give functionality to the selected sprite, **drag a block** from the sidebar and **drop it** into that sprite's Script Area on the right.
*   Blocks can be arranged in sequence to form a script. They will snap together.
*   Many blocks have input fields (e.g., for movement distance, duration, or text). Click these fields to type in your desired values.

### 4. Controlling Animations
*   **Play:** After building scripts, click the **Play button** (▶️ icon, located below the canvas and script area) to start the animations for all sprites.
*   **Pause/Resume:** While animations are playing, the Play button will change to a **Pause button** (⏸️ icon). Click it to pause the animations. Click it again (it will revert to a Play icon) to resume.
*   **Reset:** Click the **Reset button** (🔄 icon) to stop all animations, return sprites to their original starting positions and states, and turn off the Hero Feature if it was enabled.

### 5. Hero Feature (Collision & Script Swapping)
*   This feature requires **two sprites** to be on the canvas.
*   Find the **"Hero Feature" checkbox** located near the Play/Reset buttons.
*   **Enable** this checkbox to activate the collision mechanism.
*   When the Hero Feature is active and two sprites collide while their scripts are running:
    *   The scripts of the two colliding sprites will be **swapped**. (Sprite 1 gets Sprite 2's script, and Sprite 2 gets Sprite 1's script).
    *   The newly assigned scripts will then begin to execute on their respective sprites after a brief delay.

---

This README was generated based on project understanding and user input.
