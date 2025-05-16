package com.mp.MPlayer;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class PlaylistTest {

    static WebDriver driver;

    @BeforeAll
    public static void setUp(){
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:8080/index.html");
    }

    @Test
    public void playlistTest(){
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.clear();
        usernameInput.sendKeys("Reljo");

        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys("Reljo");

        driver.findElement(By.tagName("button")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        WebElement newPlaylist = wait.until(ExpectedConditions.elementToBeClickable(By.id("new-playlist-btn")));
        newPlaylist.click();

        WebElement playlistNameInput = wait.until(ExpectedConditions.elementToBeClickable(By.id("playlist-name")));
        playlistNameInput.sendKeys("TestPlaylist");

        driver.findElement(By.cssSelector(".modal-content button")).click();
        wait.until(ExpectedConditions.alertIsPresent());

        Alert alert = driver.switchTo().alert();
        String text = alert.getText();

        assertEquals(text, "Playlist created successfully!");
    }

    @AfterAll
    public static void tearDown(){
        driver.quit();
    }
}
