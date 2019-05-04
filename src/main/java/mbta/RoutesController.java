package mbta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Arrays;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class RoutesController {

    @Autowired
    RestTemplate restTemplate;

    @RequestMapping(value = "/routes")
    public String getVehicleList() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);

        //return restTemplate.exchange("https://api-v3.mbta.com/vehicles", HttpMethod.GET, entity, String.class).getBody();

        ResponseEntity<Object> responseEntity = restTemplate.getForEntity("https://api-v3.mbta.com/vehicles", Object.class);
        Object objects = responseEntity.getBody();
        return objects.toString();
    }
}
