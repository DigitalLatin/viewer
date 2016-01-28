<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:t="http://www.tei-c.org/ns/1.0"
  exclude-result-prefixes="xs t"
  version="2.0">
  <xsl:output indent="no" omit-xml-declaration="yes" method="html"/>
  
  <xsl:param name="base"></xsl:param><!-- http://digitallatin.github.io/viewer/ -->
  
  <xsl:template match="/">
    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>
    <html>
      <head>
        <link rel="stylesheet" href="{$base}css/tei-html.css"/>
        <link rel="stylesheet" href="{$base}js/jquery-ui-1.11.4.custom/jquery-ui.css"/>
        <script type="text/javascript" src="{$base}js/elements.js"></script>
        <script type="text/javascript" src="{$base}js/jquery/jquery-1.11.3.js"></script>
        <script type="text/javascript" src="{$base}js/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
        <script type="text/javascript" src="{$base}js/display.js"></script>
        <script type="text/javascript" src="{$base}js/appcrit.js"></script>
      </head>
      <body>
        <div id="navigation">
          <h2>Contents:</h2>
          <ul>
            <xsl:for-each select="//t:div[@type='textpart']">
              <li><a href="#{@xml:id}"><xsl:value-of select="t:head"/></a></li>
            </xsl:for-each>
          </ul>
        </div>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="*" xml:space="preserve"><xsl:element name="tei-{local-name(.)}"><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element></xsl:template>
  
  <xsl:template match="t:app|t:lem|t:rdg" xml:space="preserve"><xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="generate-id()"/><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element></xsl:template>
  
  <xsl:template match="@xml:id">
    <xsl:attribute name="id"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@xml:lang">
    <xsl:attribute name="lang"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@xml:space">
    <xsl:attribute name="xml-space"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@*">
    <xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>
  
  <xsl:template match="t:div[@type]">
    <xsl:element name="tei-{local-name(.)}"><xsl:apply-templates select="@*"/><xsl:attribute name="class"><xsl:value-of select="@type"/></xsl:attribute><xsl:apply-templates select="node()"/></xsl:element>
  </xsl:template>
  
  <xsl:template match="t:titleStmt/t:editor">
    <xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="generate-id()"/><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element><xsl:choose>
      <xsl:when test="following-sibling::t:editor"><span>, </span></xsl:when>
      <xsl:otherwise>
        <xsl:choose>
          <xsl:when test="preceding-sibling::t:editor"><span> edd.</span></xsl:when>
          <xsl:otherwise><span> ed.</span></xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="t:rdgGrp[@type='anteCorr']/t:rdg[1]"><xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="generate-id()"/><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element><span> (corr.) </span>
  </xsl:template>
  
</xsl:stylesheet>