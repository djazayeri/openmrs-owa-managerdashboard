angular.module("managerdashboard")
    .factory("QueryConstants", [ function() {
        var startAndEndDateParameters = "<parameters>" +
            "  <org.openmrs.module.reporting.evaluation.parameter.Parameter>\n" +
            "    <name>startDate</name>\n" +
            "    <label></label>\n" +
            "    <type>java.util.Date</type>\n" +
            "    <required>true</required>\n" +
            "  </org.openmrs.module.reporting.evaluation.parameter.Parameter>\n" +
            "  <org.openmrs.module.reporting.evaluation.parameter.Parameter>\n" +
            "    <name>endDate</name>\n" +
            "    <label></label>\n" +
            "    <type>java.util.Date</type>\n" +
            "    <required>true</required>\n" +
            "  </org.openmrs.module.reporting.evaluation.parameter.Parameter>\n" +
            "</parameters>";
        var hasEncounterSearchEntry = "  <entry>" +
            "    <string>hasEncounter</string>" +
            "    <org.openmrs.module.reporting.evaluation.parameter.Mapped>" +
            "      <parameterizable class=\"org.openmrs.module.reporting.cohort.definition.DefinitionLibraryCohortDefinition\">" +
            "        <definitionKey>reporting.library.cohortDefinition.builtIn.anyEncounterDuringPeriod</definitionKey>" +
            startAndEndDateParameters +
            "      </parameterizable>" +
            "      <parameterMappings>" +
            "        <entry>" +
            "          <string>startDate</string>" +
            "          <string>${startDate}</string>" +
            "        </entry>" +
            "        <entry>" +
            "          <string>endDate</string>" +
            "          <string>${endDate}</string>" +
            "        </entry>" +
            "      </parameterMappings>" +
            "    </org.openmrs.module.reporting.evaluation.parameter.Mapped>" +
            "  </entry>";

        return {
            malesWithEncounterDuringPeriod: "<org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition>" +
                startAndEndDateParameters +
                "<compositionString>male AND hasEncounter</compositionString>" +
                "<searches>" +
                "  <entry>" +
                "    <string>male</string>" +
                "    <org.openmrs.module.reporting.evaluation.parameter.Mapped>" +
                "      <parameterizable class=\"org.openmrs.module.reporting.cohort.definition.DefinitionLibraryCohortDefinition\">" +
                "        <definitionKey>reporting.library.cohortDefinition.builtIn.males</definitionKey>" +
                "      </parameterizable>" +
                "      <parameterMappings/>" +
                "    </org.openmrs.module.reporting.evaluation.parameter.Mapped>" +
                "  </entry>" +
                hasEncounterSearchEntry +
                "</searches>" +
                "</org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition>",

            femalesWithEncounterDuringPeriod: "<org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition>" +
                startAndEndDateParameters +
                "<compositionString>female AND hasEncounter</compositionString>" +
                "<searches>" +
                "  <entry>" +
                "    <string>female</string>" +
                "    <org.openmrs.module.reporting.evaluation.parameter.Mapped>" +
                "      <parameterizable class=\"org.openmrs.module.reporting.cohort.definition.DefinitionLibraryCohortDefinition\">" +
                "        <definitionKey>reporting.library.cohortDefinition.builtIn.females</definitionKey>" +
                "      </parameterizable>" +
                "      <parameterMappings/>" +
                "    </org.openmrs.module.reporting.evaluation.parameter.Mapped>" +
                "  </entry>" +
                hasEncounterSearchEntry +
                "</searches>" +
                "</org.openmrs.module.reporting.cohort.definition.CompositionCohortDefinition>"
        }
    }]);