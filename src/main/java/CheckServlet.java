import javax.json.Json;
import javax.json.JsonObject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/check")
public class CheckServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        int status = response.getStatus();
        String str = convertToJson(status);
        PrintWriter printWriter = response.getWriter();
        printWriter.write(str);
        printWriter.close();
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    public static String convertToJson(int success){
        JsonObject jo;
        if(success == 200){
            jo = Json.createObjectBuilder().add("success", true).build();
        } else {
            jo = Json.createObjectBuilder().add("success", false).build();
        }
        return jo.toString();
    }

}
