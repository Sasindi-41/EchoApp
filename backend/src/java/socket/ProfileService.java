/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package socket;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;


public class ProfileService {

    public boolean saveProfileImage(int userId, HttpServletRequest request) throws IOException, ServletException {
        Part profileImage = request.getPart("profileImage");
        String appPath = request.getServletContext().getRealPath(""); //Full path of the Web Pages folder

        String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "profile-images");

        File profileFolder = new File(newPath, String.valueOf(userId));
        if (!profileFolder.exists()) {
            profileFolder.mkdirs();
        }

        File file1 = new File(profileFolder, "profile1.png");
        Files.copy(profileImage.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

        return true;
    }

    public static String getProfileUrl(int userId) {
        HttpURLConnection connection = null;
        try {
            // The app is deployed under /EchoApp on the local Payara server.
            URL localUrl = new URI(
                    "http://localhost:8080/EchoApp/profile-images/" + userId + "/profile1.png"
            ).toURL();

            connection = (HttpURLConnection) localUrl.openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(3000);
            connection.setReadTimeout(3000);

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                String publicBaseUrl = ChatService.getPublicBaseUrl();
                if (publicBaseUrl != null && !publicBaseUrl.isEmpty()) {
                    return publicBaseUrl + "/profile-images/" + userId + "/profile1.png";
                }
            }
            return "";
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
            return "";
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }
    
    
}
